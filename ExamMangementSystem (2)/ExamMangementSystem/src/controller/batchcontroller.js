let batchm=require("../models/batchmodel");

exports.createBatch = (req, res) => {
  const { batch_name } = req.body;

  if (!batch_name) {
    return res.status(400).send({ error: "Batch name is required" });
  }

  let promise = batchm.createBatch(batch_name);

  promise
    .then((result) => res.send({ result }))
    .catch((err) => res.status(500).send({ error: err }));
};

exports.assignBatch = (req, res) => {
  const { userid, batch_id } = req.body;

  if (!userid || !batch_id) {
    return res.status(400).send({ error: "User ID and Batch ID are required" });
  }

  let promise = batchm.assignBatch(userid, batch_id);

  promise
    .then((result) => res.send({ result }))
    .catch((err) => res.status(500).send({ error: err }));
};

exports.getUnassignedStudents = (req, res) => {
  let promise = batchm.getUnassignedStudents();

  promise
    .then((result) => res.send({ students: result }))
    .catch((err) => res.status(500).send({ error: err }));
};

exports.getAllBatches = (req, res) => {
  let promise = batchm.getAllBatches();
  promise
    .then((result) => res.send({ batches: result }))
    .catch((err) => res.status(500).send({ error: err }));
};


