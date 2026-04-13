const supabase = require('../config/supabaseClient');

exports.getDashboardStats = async (req, res) => {
  try {
    // We execute counts in parallel
    const [
      { count: totalOrders },
      { count: activeOrders },
      { count: delayedOrders },
      { count: totalWorkers },
      { count: activeMachines }
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['Spinning', 'Weaving', 'Dyeing']),
      supabase.from('orders').select('*', { count: 'exact', head: true }).lt('deadline', new Date().toISOString()).neq('status', 'Finished'),
      supabase.from('workers').select('*', { count: 'exact', head: true }),
      supabase.from('machines').select('*', { count: 'exact', head: true }).eq('status', 'Running')
    ]);

    res.json({
      totalOrders: totalOrders || 0,
      activeOrders: activeOrders || 0,
      delayedOrders: delayedOrders || 0,
      totalWorkers: totalWorkers || 0,
      activeMachines: activeMachines || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
