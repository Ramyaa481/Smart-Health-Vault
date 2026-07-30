'use strict';
const express = require('express');
const cors = require('cors');
const catalyst = require('zcatalyst-sdk-node');
const app = express();

app.use(cors());
app.use(express.json());

// GET all records
app.get('/', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const rows = await catalystApp.zcql().executeZCQLQuery("SELECT * FROM HealthRecords");
    res.status(200).send(rows);
  } catch (err) {
    console.log("Fetch error:", err);
    res.status(500).send({ error: err.message });
  }
});

// POST a new record
app.post('/', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('HealthRecords');
    const body = req.body;
    const row = await table.insertRow({
      patient_name: body.patient_name,
      age: parseInt(body.age),
      health_condition: body.health_condition,
      notes: body.notes
    });
    res.status(200).send({ success: true, row });
  } catch (err) {
    console.log("Insert error:", err);
    res.status(500).send({ error: err.message });
  }
});

// PUT (update) a record by ROWID
app.put('/:rowid', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('HealthRecords');
    const body = req.body;
    const updated = await table.updateRow({
      ROWID: req.params.rowid,
      patient_name: body.patient_name,
      age: parseInt(body.age),
      health_condition: body.health_condition,
      notes: body.notes
    });
    res.status(200).send({ success: true, updated });
  } catch (err) {
    console.log("Update error:", err);
    res.status(500).send({ error: err.message });
  }
});

// DELETE a record by ROWID
app.delete('/:rowid', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('HealthRecords');
    await table.deleteRow(req.params.rowid);
    res.status(200).send({ success: true });
  } catch (err) {
    console.log("Delete error:", err);
    res.status(500).send({ error: err.message });
  }
});

module.exports = app;
