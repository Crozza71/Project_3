var Ticket = require("../models/ticket");
var Seller = require("../models/seller");
var Buyer = require("../models/buyer");

function ticketsIndex(req, res){
  Ticket.find({}, function(err, tickets) {
    if (err) return res.status(404).send(err);

    res.status(200).send(tickets);
  });
}

function ticketsCreate(req, res){
  
  var newTicket = new Ticket({
    event: req.body.ticket.event,
    date: req.body.ticket.date,
    price: req.body.ticket.price
  })

  newTicket.save(function(err){
    if (err) return res.status(500).send(err);

    var id = req.body.ticket.id;
      
    Seller.findByIdAndUpdate(id, { $push: { tickets: newTicket._id}  }, function(err, seller){
      if (err) return res.status(404).json({message : err});
      return res.status(200).send(newTicket);

    });
  });
}

function ticketsShow(req, res){
  var id = req.params.id;

  Ticket.findById({ _id: id }, function(err, ticket) {
    if (err) return res.status(500).send(err);
    if (!ticket) return res.status(404).send(err);

    res.status(200).send(ticket);
  })
}

function ticketsUpdate(req, res){
  var id = req.params.id;

  Ticket.findByIdAndUpdate({ _id: id }, req.body.ticket, function(err, ticket){
    if (err) return res.status(500).send(err);
    if (!ticket) return res.status(404).send(err);

    res.status(200).send(ticket);
  })
}

function ticketsDelete(req, res){
  var id = req.params.id;

  Ticket.findByIdAndRemove({ _id: id }, function(err) {
    if (err) return res.status(500).send(err);
    res.status(200).json({ message: "Ticket deleted"});
  })
}

module.exports = {
  ticketsIndex:  ticketsIndex,
  ticketsCreate: ticketsCreate,
  ticketsShow:   ticketsShow,
  ticketsUpdate: ticketsUpdate,
  ticketsDelete: ticketsDelete
}