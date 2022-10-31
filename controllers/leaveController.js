const express = require("express");
const leaveSchema = require('../models/Leave');
const router = express.Router();
let mongoId = require('mongoose').Types.ObjectId;

router.post('/addLeaveRequest', async (req, res) => {
    let leave = req.body;
    try {
        let newLeaveRequest = new leaveSchema({
            ...leave
        });
        newLeaveRequest.save((err, doc) => {
            if (!err) {
                res.send({ "msg": "Leave request made successfully" })
            } else {
                res.status(500).send();
            }
        })
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/getLeaveRequests', async (req, res) => {
    leaveSchema.find(req.query, (err, leaveRequests) => {
        if (!err) {
            try {
                res.send(leaveRequests)
            } catch (error) {
                res.status(500).send();
            }
        } else {
            res.status(500).send();
        }
    });
})

router.delete('/deleteLeaveRequest/:id', (req, res) => {
    if (!mongoId.isValid(req.params.id)) {
        res.status(400).send({ msg: 'Not a valid Mongo ID' });
    } else {
        leaveSchema.findByIdAndDelete(req.params.id, async (err, doc) => {
            if (!err) {
                try {
                    res.send({ msg: 'Leave request deleted successfully!' })
                } catch (error) {
                    res.status(500).send(error);
                }
            } else {
                res.status(400).send({ msg: 'Error deleting leave request!' });
            }
        })
    }
})

router.put('/editLeaveRequest/:id', (req, res) => {
    if (!mongoId.isValid(req.params.id)) {
        res.status(400).send({ msg: 'Invalid Mongo ID' });
    } else {
        let updatedLeaveRequest = { ...req.body };
        leaveSchema.findByIdAndUpdate(req.params.id, { $set: updatedLeaveRequest }, { new: true }, (err, doc) => {
            if (!err) {
                res.send({ msg: 'Leave request updated successfully' })
            } else {
                res.status(400).send({ msg: 'Error updating leave request' });
            }
        })
    }
})

router.put('/changeStatus/:id', (req, res) => {
    if (!mongoId.isValid(req.params.id)) {
        res.status(400).send({ msg: 'Invalid Mongo ID' });
    } else {
        leaveSchema.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { new: true }, (err, doc) => {
            if (!err) {
                res.send({ msg: 'Leave request updated successfully' })
            } else {
                res.status(400).send({ msg: 'Error updating leave request' });
            }
        })
    }
})
module.exports = router;
