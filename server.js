const express = require('express');
const fs = require('fs');
const app = express();
const port = 8888;

var characters = JSON.parse(fs.readFileSync('data/characters.min.json', 'utf8'));
var gear = JSON.parse(fs.readFileSync('data/gear.min.json', 'utf8'));
var char_detail = JSON.parse(fs.readFileSync('data/character_detail.min.json', 'utf8'));
var char_tags = JSON.parse(fs.readFileSync('data/character_tags.min.json', 'utf8'));

//when server first starts we need to 'operate' on the traits for each character
setupCharacterTraits();

/*app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
})*/

app.get('/v1/characters', (req, res) => {
    var chars = [];
    for (char in char_detail) {
        if (parseInt(char_detail[char]["Playable"]) == 0) {
            chars.push({ "name": char_detail[char].Name, "id": char });
        }
    }
    res.send(chars);
});

app.get('/v1/character/:charId/tags/:type?', (req, res, next) => {
    var type = req.params.type;

    var charDetails = getIgnoreCase(char_detail, req.params.charId);
    if (charDetails) {
        var charTraits = charDetails.traits;

        if (!type) {
            res.send(charTraits);
        } else {
            res.send(getIgnoreCase(charTraits, type));
        }
    } else {
        res.send('Character not found!')
    }
})

app.get('/v1/character/:charId/items/:tierLevel?', (req, res, next) => {
    var tierLevel = req.params.tierLevel;

    //create a deep copy
    var charInfo = JSON.parse(JSON.stringify(getIgnoreCase(characters, req.params.charId)));

    if (charInfo) {
        if (!tierLevel) {
            for (level in charInfo) {
                //delete the stats.. this is why we wanted a deep copy
                delete charInfo[level].stats
            }
            res.send(charInfo);
        } else {
            res.send(charInfo[req.params.tierLevel].slots);
        }
    } else {
        res.send('Character not found!')
    }
});

app.get('/v1/character/:charId/stats/:tierLevel?', (req, res, next) => {
    var tierLevel = req.params.tierLevel;

    //create a deep copy
    var charInfo = JSON.parse(JSON.stringify(getIgnoreCase(characters, req.params.charId)));

    if (charInfo) {
        if (!tierLevel) {
            for (level in charInfo) {
                //delete the slots.. this is why we wanted a deep copy
                delete charInfo[level].slots
            }
            res.send(charInfo);
        } else {
            res.send(charInfo[req.params.tierLevel].stats);
        }
    } else {
        res.send('Character not found!')
    }
});

app.get('/v1/character/:charId', (req, res) => {
    var charData = {};

    var charDetails = getIgnoreCase(char_detail, req.params.charId);

    charData["details"] = charDetails;
    charData["levels"] = getIgnoreCase(characters, req.params.charId);

    res.send(charData);
});

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

//error handler
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke, check server logs');
})

app.listen(port, () => console.log(`App listening on port ${port}`));

function getIgnoreCase(JSONObject, key) {
    var objKeys = Object.keys(JSONObject).reduce((keys, k) => {
        keys[k.toLowerCase()] = k;
        return keys
    }, {});

    return JSONObject[objKeys[key.toLowerCase()]];
}

function getTagDetails(charTraits) {
    var foundTag
    var newJson = {};

    charTraits.forEach((trait) => {
        Object.keys(char_tags).forEach((type) => {
            if (newJson[type] === undefined) newJson[type] = [];
            char_tags[type].forEach((tagItem) => {
                if (tagItem.value == trait) {
                    foundTag = {};
                    //foundTag["type"] = type;
                    foundTag["name"] = tagItem.name;
                    foundTag["value"] = tagItem.value;
                    newJson[type].push(foundTag);
                }
            });
        });
    });
    //console.log(newJson);
    return newJson;
}

function setupCharacterTraits() {
    for (key in char_detail) {
        var characterDetails = char_detail[key]
        var charTraits = characterDetails.traits;
        delete characterDetails.traits;
        characterDetails["traits"] = getTagDetails(charTraits);
    }
}