const express = require('express');
const fs = require('fs');
const app = express();
const port = 8888;

var characters = JSON.parse(fs.readFileSync('data/characters.min.json', 'utf8'));
var gear = JSON.parse(fs.readFileSync('data/gear.min.json', 'utf8'));
var char_detail = JSON.parse(fs.readFileSync('data/character_detail.min.json', 'utf8'));
var char_tags = JSON.parse(fs.readFileSync('data/character_tags.min.json', 'utf8'));


app.get('/v1/characters', (req, res) => {
    var chars = [];
    for (char in char_detail) {
        if (parseInt(char_detail[char]["Playable"]) == 0) {
            chars.push({ "name": char_detail[char].Name, "id": char });
        }
    }
    res.send(chars);
});

app.get('/v1/character/:charId', (req, res) => {
    res.send(getIgnoreCase(characters, req.params.charId));
});

app.get('/v1/character/:charId/:tierLevel', (req, res) => {
    res.send(getIgnoreCase(characters, req.params.charId)[req.params.tierLevel].slots);
});

/*app.get('/character/:charId/:tierId/:slotId', (req, res) => {
    var slotId = req.params.slotId;
    var slotLvlReq;

    slotId = getIgnoreCase(characters, req.params.charId)[req.params.tierId].slots['slot' + req.params.slotId + '_ID']).key  }

    res.send();
});*/

app.get('/v1/detail/:charId', (req, res) => {
    res.send(getIgnoreCase(char_detail, req.params.charId));
})

app.get('/v1/detail/:charId/tags', (req, res) => {
    res.send(getIgnoreCase(getIgnoreCase(char_detail, req.params.charId), 'traits'));
})

app.get('/v1/gear/:gearId/:tier?', (req, res) => {
    var tier = req.params.tier;
    if (!tier) {
        res.send(getIgnoreCase(gear, req.params.gearId));
    } else {
        res.send(getIgnoreCase(gear, req.params.gearId)[tier]);
    }
});

app.get('/v1/tags/:type?', (req, res) => {
    var type = req.params.type;

    if (!type) {
        res.send(char_tags)
    } else {
        res.send(getIgnoreCase(char_tags, type));
    }
})

app.listen(port, () => console.log(`App listening on port ${port}`));

function getIgnoreCase(JSONObject, key) {
    var objKeys = Object.keys(JSONObject).reduce((keys, k) => {
        keys[k.toLowerCase()] = k;
        return keys
    }, {});

    return JSONObject[objKeys[key.toLowerCase()]];
}