import { Ticket } from "../models/tickets.js";

// Create a new ticket
export const createTicket = async (req, res) => {
    const { title, description, gender, country, price } = req.body;

    console.log('Here');
    console.log(`Role: ${country}`);
    

    if (req.user.role !== 'host') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const ticket = new Ticket({ title, description, gender, country, price, host: req.user._id });
        await ticket.save();
        res.status(201).json({message: 'Ticket created successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Failed to create ticket' });
    }
};

// Get all tickets
export const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get tickets' });
    }
};

// Get a single ticket
export const getTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get ticket' });
    }
};

// Get tickets by host
export const getTicketsByHost = async (req, res) => {
    try {
        const tickets = await Ticket.find({ host: req.user._id });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get tickets by host' });
    }
};

// Update a ticket
export const updateTicket = async (req, res) => {
    const { title, description, gender, country, price } = req.body;
    
    try {
        const ticket = await Ticket.findById(req.params.id);
        
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check if user is the host of the ticket
        if (ticket.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to update this ticket' });
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { 
                title, 
                description, 
                gender, 
                country, 
                price,
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ticket' });
    }
};

// Delete a ticket
export const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check if user is the host of the ticket
        if (ticket.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to delete this ticket' });
        }

        await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
};
