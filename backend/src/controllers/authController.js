const supabase = require('../config/supabaseClient');

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: role || 'Worker' }
      }
    });

    if (authError) return res.status(400).json({ message: authError.message });

    // Store profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: authData.user.id, name, role: role || 'Worker' }]);
        
      if (profileError) return res.status(400).json({ message: profileError.message });
    }

    res.status(201).json({
      _id: authData.user.id, name, email, role: role || 'Worker',
      token: authData.session?.access_token || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ message: error.message });

    const { data: profile } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', data.user.id)
      .single();

    res.json({
      _id: data.user.id, name: profile?.name, email, role: profile?.role,
      token: data.session.access_token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
