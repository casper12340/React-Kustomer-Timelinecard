const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('kustomer-timeline-card/build'));
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get('/api/huts/:id', (req, res) => {
    const id = req.params.id;
    const huts = getHuts(id);
    if (!huts){
        res.status(404).send({error: `Huts ${id} bestaat niet`})
    }
    else{
        res.send({data:huts});
    }
})

function getHuts(id){
    const huts = [{id:1, naam:"Paulus"}, {id:2, naam:"Peter"}];
    return huts.find(p => p.id ==id);
}