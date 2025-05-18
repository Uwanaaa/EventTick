import express from 'express'
import { createTicket, getAllTickets, getTicketsByHost, getTicket, updateTicket, deleteTicket } from '../controllers/ticketController.js'
import { authenticate } from '../middlewares/authenticate.js'

export const ticketRouter = express.Router()

ticketRouter.post('/create', authenticate, createTicket)
ticketRouter.get('/tickets', getAllTickets)
ticketRouter.get('/my-tickets', getTicketsByHost)
ticketRouter.get('/ticket/:id', getTicket)
ticketRouter.put('/ticket/:id', authenticate, updateTicket)
ticketRouter.delete('/ticket/:id', authenticate, deleteTicket)