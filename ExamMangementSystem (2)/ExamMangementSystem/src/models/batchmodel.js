let db=require("../../db.js");

exports.createBatch = (batch_name) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO batch (batch_name) VALUES (?)",
      [batch_name],
      (err, result) => {
        if (err) {
          console.log(err);
          reject("Batch not created: " + err);
        } else {
          resolve("Batch created successfully");
        }
      }
    );
  });
};

exports.assignBatch = (userid, batch_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET batch_id = ? WHERE userid = ? AND role = 'Student'",
      [batch_id, userid],
      (err, result) => {
        if (err) {
          console.log(err);
          reject("Batch not assigned: " + err);
        } else if (result.affectedRows === 0) {
          reject("No student found with that ID");
        } else {
          resolve("Batch assigned successfully");
        }
      }
    );
  });
};

exports.getUnassignedStudents = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT userid, name, email FROM users WHERE role = 'Student' AND batch_id IS NULL",
      (err, rows) => {
        if (err) {
          console.log(err);
          reject("Error fetching students: " + err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

exports.getAllBatches = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT batch_id, batch_name FROM batch", (err, rows) => {
      if (err) {
        reject("Error fetching batches: " + err);
      } else {
        resolve(rows);
      }
    });
  });
};

