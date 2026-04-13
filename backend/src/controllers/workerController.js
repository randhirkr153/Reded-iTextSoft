const supabase = require('../config/supabaseClient');

exports.getWorkers = async (req, res) => {
  try {
    const { data: workers, error } = await supabase
      .from('workers')
      .select(`
        *,
        orders:assigned_task_id(id, name, status)
      `);
      
    if (error) throw error;
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editWorker = async (req, res) => {
  try {
    const { name, role } = req.body;
    
    // Update Profile
    const { error: pErr } = await supabase.from('profiles').update({ name, role }).eq('id', req.params.id);
    if (pErr) throw pErr;

    // Update Worker table
    const { data: worker, error: wErr } = await supabase.from('workers').update({ name, role }).eq('id', req.params.id).select().single();
    if (wErr) throw wErr;

    res.json(worker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addWorker = async (req, res) => {
  try {
    const { name, role, email, password } = req.body;
    
    // 1. Create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw authError;
    const userId = authData.user.id;

    // 2. Insert into Profiles as 'Worker'
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: userId, name, role: 'Worker' }
    ]);
    if (profileError) throw profileError;

    // 3. Insert into Workers table with same ID so they are linked natively
    const { data: worker, error: workerError } = await supabase.from('workers').insert([
      { id: userId, name, role }
    ]).select().single();

    if (workerError) throw workerError;

    res.status(201).json(worker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.assignWorker = async (req, res) => {
  try {
    const { assigned_task_id } = req.body;
    const { data: worker, error } = await supabase
      .from('workers')
      .update({ assigned_task_id, status: assigned_task_id ? 'Busy' : 'Active' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(worker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyTask = async (req, res) => {
  try {
    // 1. Try exact Auth ID match
    let { data: worker, error } = await supabase
      .from('workers')
      .select(`*, orders:assigned_task_id(*)`)
      .eq('id', req.user.id)
      .single();
      
    // 2. If not found, try fallback Name match for old unlinked accounts
    if (!worker) {
      const { data: profile } = await supabase.from('profiles').select('name').eq('id', req.user.id).single();
      if (profile && profile.name) {
        const { data: fallbackWorker } = await supabase
          .from('workers')
          .select(`*, orders:assigned_task_id(*)`)
          .ilike('name', profile.name)
          .single();
        worker = fallbackWorker;
      }
    }
      
    if (!worker) return res.json(null);
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMyTaskProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    // Get worker to find their task
    const { data: worker, error: wError } = await supabase
      .from('workers')
      .select('assigned_task_id')
      .eq('id', req.user.id)
      .single();
      
    if (wError) throw wError;
    if (!worker.assigned_task_id) return res.status(400).json({ message: "No task assigned." });

    const statusObj = progress >= 100 ? { progress: 100, status: 'Finished' } : { progress };

    const { data: order, error: oError } = await supabase
      .from('orders')
      .update(statusObj)
      .eq('id', worker.assigned_task_id)
      .select()
      .single();

    if (oError) throw oError;
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
