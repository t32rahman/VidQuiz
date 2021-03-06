const axios = require('axios');
const { text } = require('express');
const express = require('express');
const app = express();
var cors = require('cors');
const PORT = 3000;

app.use(cors());

app.get('/search/:targetWord', async(req, res) => {
    var videoURL = decodeURIComponent("youtube.com/api/timedtext?v=lsO6gwLjhZE\u0026asr_langs=de,en,es,fr,it,ja,ko,nl,pt,ru\u0026caps=asr\u0026exp=xftt\u0026xorp=true\u0026xoaf=5\u0026hl=en\u0026ip=0.0.0.0\u0026ipbits=0\u0026expire=1613341981\u0026sparams=ip,ipbits,expire,v,asr_langs,caps,exp,xorp,xoaf\u0026signature=838BBF137163189CDAA205813CDD4E0AE894EFF3.3D42472141F5C0EADFD610A95B90945F8ED68ECD\u0026key=yt8\u0026kind=asr\u0026lang=en");
    var targetWord = req.params.targetWord;
    var url = "http://localhost:3000/transcribe/" + targetWord + "/" + encodeURIComponent(videoURL);
    await axios({
        method: "GET",
        url: url,
        headers: {
          "Content-Type": "application/json"
        }
    }).then(response => {
        // console.log(response.data);
        res.send(response.data);
    });

})



app.get('/', async (req, res) => {
    res.send("Hello Wolrd");
})
 
app.get('/transcribe/:targetWord/:url', async(req, res) => {
    baseURL = decodeURIComponent(req.params.url);
    var url = "https://" + baseURL + "&fmt=json3";

    var targetWord = req.params.targetWord;

    var data;
    await axios({
        method: "GET",
        url: url,
        headers: {
          "Content-Type": "application/json"
        }
    }).then(response => {
        data = response.data
    });

    var events = data['events'];
    // var words = [];
    var times = []
    for (var i = 0; i < events.length; i++) {
        if (!('segs' in events[i])){
            continue;
        }
        for (var j = 0; j < events[i]['segs'].length; j++) {
            // try {
            //     words.push(events[i]['segs'][j]['utf8']);
            // }
            // catch(err) {
            //     console.log(err.message);
            //     res.send(err.message);
            // }

            if (events[i]['segs'][j]['utf8'].trim().localeCompare(targetWord.toLowerCase().trim()) == 0) {
                // console.log(events[i]['segs'][j]['utf8']);
                // console.log("Found");
                // console.log(events[i]['tStartMs']);
                var time = events[i]['tStartMs'];
                var min = parseInt(time / 60000);
                var sec = parseInt((time / 1000) % 60);

                if (sec / 10 < 1) {
                    var fmtTime = min + ":0" + parseInt((time / 1000) % 60);
                } else {
                    var fmtTime = min + ":" + parseInt((time / 1000) % 60);
                }

                
                times.push(fmtTime);
                // console.log("Found");
            }
            // if (events[i]['segs'][j]['utf8'] === targetWord) {
            //     // console.log(events[i]['segs'][j]['utf8']);
                
            //     console.log("Found");
            //     console.log(events[i]['tStartMs']);
            // }
        }
    }
    // var text = words.join(" ");
    res.json({"times": times});


})
 
app.listen(PORT, () => {
    console.log(`App launched on ${PORT}`);
  });