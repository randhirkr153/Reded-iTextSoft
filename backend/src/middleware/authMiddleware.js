const supabase = require('../config/supabaseClient');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }

  // Get user profile role
  let { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (!profile) {
    await supabase.from('profiles').insert([{ id: user.id, name: 'Root Admin', role: 'Admin' }]);
    profile = { role: 'Admin' };
  }

  req.user = { id: user.id, email: user.email, role: profile?.role || 'Admin' };
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role ${req.user?.role} is not authorized` });
    }
    next();
  };
};

module.exports = { protect, authorize };
