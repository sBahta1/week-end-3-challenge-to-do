// require express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/todolists';
//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Schema
const Schema = mongoose.Schema;

const ToDoSchema = new Schema({
    task: { type: String },
    completed: { type: Boolean },
});
const Task = mongoose.model('honeyDo', ToDoSchema)

//connecting mongoose and mongodb

mongoose.connect(mongoURI, { useNewUrlParser: true });
mongoose.connection.on('open', () => {
    console.log('Connected to Mongo');
});
mongoose.connection.on('error', (error) => {
    console.log('ERROR CONNECTING TO MONGO', error);
});

// Static files
app.use(express.static('server/public'));

//GET Lists
app.get('/toDoList', (req, res) => {
    console.log('GET toDoLists');
    Task.find({}).then((foundTasks) => {
        res.send(foundTasks);
    })
});


//POST New Tasks
app.post('/toDoList', (req, res) => {
    console.log('POST to /toDoList req.body =', req.body);
    const dataFromClient = req.body;
    const taskToAdd = new Task(dataFromClient);
    taskToAdd.save().then(() => {
        console.log('Task added', taskToAdd);
        res.sendStatus(200);
    }).catch((error) => {
        res.sendStatus(500);
    })
});

//Delete tasks
app.delete('/toDoList/:id', (req, res) => {
    Task.findByIdAndRemove(req.params.id).then((response) => {
        res.sendStatus(200);
    }).catch((error) => {
        res.sendStatus(500);
    });
});

//completed Tasks
app.put('/toDoList/:id', (req, res) => {
    console.log('update', req.params.id);
    Task.findOne({ _id: req.params.id }).then((foundTask) => {
        console.log(foundTask);
        foundTask.completed = true;
        foundTask.save().then((response) => {
            res.sendStatus(200);
        }).catch((error) => {
            res.sendStatus(500);
        });
    });
});



app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
