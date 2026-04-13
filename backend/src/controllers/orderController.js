const supabase = require('../config/supabaseClient');

exports.createOrder = async (req, res) => {
  try {
    const { name, deadline } = req.body;
    const { data: order, error } = await supabase
      .from('orders')
      .insert([{ name, deadline }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        machines (name, status),
        workers (id, name, role)
      `); // Adjusted to fetch relationships if applicable
      
    if (error) throw error;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderProgress = async (req, res) => {
  try {
    const { progress, status } = req.body;
    const { data: order, error } = await supabase
      .from('orders')
      .update({ progress, status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
