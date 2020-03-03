const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

var characters = JSON.parse(fs.readFileSync('data/characters.min.json', 'utf8'));
var gear = JSON.parse(fs.readFileSync('data/gear.min.json', 'utf8'));
var char_detail = JSON.parse(fs.readFileSync('data/character_detail.min.json', 'utf8'));

app.get('/character/:charId/:slotId', function (req, res) {
    res.send(characters[req.params["charId"]][req.params["slotId"]].slots);
});

app.get('/character/:charId', function( req, res) {
    res.send(characters[req.params["charId"]]);
});

app.get('/characters', function (req, res) {
    var chars = [];
    for (char in char_detail) {
        if (parseInt(char_detail[char]["Playable"]) == 0) {
            chars.push({"name": char_detail[char].Name, "id": char });
        }
    }
    res.send(chars);
});

app.get('/gear/:gearId/:level?', function (req, res) {
    var level = req.params.level;
    if (!level) {
        res.send(gear[req.params.gearId]);
    } else {
        res.send(gear[req.params.gearId][req.params.level]);
    }
    //res.send(gear[req.params["gearId"]][req.params["level"]]);
});

app.listen(port, () => console.log(`App listening on port ${port}`));