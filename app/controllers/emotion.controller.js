const db = require("../models");
const dateUtils = require("../utils/date.util");
const Emotion = db.emotion;

exports.addLog = (req, res, next) => {
    let obj = req.body;
    const allowFields = ['angry', 'disgusted', 'fearful', 'happy', 'neutral', 'sad', 'surprised'];
    Object.keys(obj).forEach((k) => (!allowFields.includes(k)) && delete obj[k]);
    var maxEmo = obj.angry;
    var nameMaxEmo = "angry";
    for (const [key, value] of Object.entries(obj)) {
        if (value > maxEmo) {
            nameMaxEmo = key;
            maxEmo = value;
        }
    }
    const emotion = new Emotion({
        ...obj,
        maxKey: nameMaxEmo,
        date: Math.round(Date.now() / 1000),
    });
    emotion.save((err, emo) => {
        if (err) {
            res.status(500).send({ message: err.message });
            return;
        }

        res.send({ message: "Successfully" });
    });
}

exports.summary = (req, res, next) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Emotion.find(
        { date: { $gte: (startOfToday.getTime() / 1000) } },
        { __v: 0 },
        { sort: { 'date': 'desc' } },
        (err, emotions) => {
            if (err) {
                res.status(500).send({ message: err.message });
                return;
            }
            const ret = {
                angry: 0,
                disgusted: 0,
                fearful: 0,
                happy: 0,
                neutral: 0,
                sad: 0,
                surprised: 0,
            };
            var numDoc = 0;
            emotions.forEach((emotion) => {
                for (var key in ret) {
                    if (ret.hasOwnProperty(key)) {
                        ret[key] += emotion[key];
                    }
                }
                numDoc++;
            });
            var maxEmo = ret.angry;
            var nameMaxEmo = "angry";
            for (const [key, value] of Object.entries(ret)) {
                if (value > maxEmo) {
                    nameMaxEmo = key;
                    maxEmo = value;
                }
            }
            for (var key in ret) {
                if (ret.hasOwnProperty(key)) {
                    ret[key] = Math.round(ret[key] * 100 / numDoc);
                }
            }
            res.send({
                total: numDoc,
                maxEmo: nameMaxEmo,
                summary: ret,
                details: emotions
            });
        }
    );
}

exports.morning = (req, res, next) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var morningToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10);
    Emotion.find(
        { date: { $gte: (startOfToday.getTime() / 1000), $lte: (morningToday.getTime() / 1000) } },
        { __v: 0 },
        { sort: { 'date': 'desc' } },
        (err, emotions) => {
            if (err) {
                res.status(500).send({ message: err.message });
                return;
            }
            const ret = {
                angry: 0,
                disgusted: 0,
                fearful: 0,
                happy: 0,
                neutral: 0,
                sad: 0,
                surprised: 0,
            };
            var numDoc = 0;
            emotions.forEach((emotion) => {
                for (var key in ret) {
                    if (ret.hasOwnProperty(key)) {
                        ret[key] += emotion[key];
                    }
                }
                numDoc++;
            });
            var maxEmo = ret.angry;
            var nameMaxEmo = "angry";
            for (const [key, value] of Object.entries(ret)) {
                if (value > maxEmo) {
                    nameMaxEmo = key;
                    maxEmo = value;
                }
            }
            for (var key in ret) {
                if (ret.hasOwnProperty(key)) {
                    ret[key] = Math.round(ret[key] * 100 / numDoc);
                }
            }
            res.send({
                total: numDoc,
                maxEmo: nameMaxEmo,
                summary: ret,
                details: emotions
            });
        }
    );
}

exports.afternoon = (req, res, next) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15);
    Emotion.find(
        { date: { $gte: (startOfToday.getTime() / 1000) } },
        { __v: 0 },
        { sort: { 'date': 'desc' } },
        (err, emotions) => {
            if (err) {
                res.status(500).send({ message: err.message });
                return;
            }
            const ret = {
                angry: 0,
                disgusted: 0,
                fearful: 0,
                happy: 0,
                neutral: 0,
                sad: 0,
                surprised: 0,
            };
            var numDoc = 0;
            emotions.forEach((emotion) => {
                for (var key in ret) {
                    if (ret.hasOwnProperty(key)) {
                        ret[key] += emotion[key];
                    }
                }
                numDoc++;
            });
            var maxEmo = ret.angry;
            var nameMaxEmo = "angry";
            for (const [key, value] of Object.entries(ret)) {
                if (value > maxEmo) {
                    nameMaxEmo = key;
                    maxEmo = value;
                }
            }
            for (var key in ret) {
                if (ret.hasOwnProperty(key)) {
                    ret[key] = Math.round(ret[key] * 100 / numDoc);
                }
            }
            res.send({
                total: numDoc,
                maxEmo: nameMaxEmo,
                summary: ret,
                details: emotions
            });
        }
    );
}

exports.week = (req, res, next) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    Emotion.find(
        { date: { $gte: (dateUtils.getMonday(startOfToday).getTime() / 1000) } },
        { __v: 0 },
        { sort: { 'date': 'desc' } },
        (err, emotions) => {
            if (err) {
                res.status(500).send({ message: err.message });
                return;
            }
            const ret = {
                angry: 0,
                disgusted: 0,
                fearful: 0,
                happy: 0,
                neutral: 0,
                sad: 0,
                surprised: 0,
            };
            var numDoc = 0;
            emotions.forEach((emotion) => {
                for (var key in ret) {
                    if (ret.hasOwnProperty(key)) {
                        ret[key] += emotion[key];
                    }
                }
                numDoc++;
            });
            var maxEmo = ret.angry;
            var nameMaxEmo = "angry";
            for (const [key, value] of Object.entries(ret)) {
                if (value > maxEmo) {
                    nameMaxEmo = key;
                    maxEmo = value;
                }
            }
            for (var key in ret) {
                if (ret.hasOwnProperty(key)) {
                    ret[key] = Math.round(ret[key] * 100 / numDoc);
                }
            }
            res.send({
                total: numDoc,
                maxEmo: nameMaxEmo,
                summary: ret,
                details: emotions
            });
        }
    );
}

exports.month = (req, res, next) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), 1);
    Emotion.find(
        { date: { $gte: (startOfToday.getTime() / 1000) } },
        { __v: 0 },
        { sort: { 'date': 'desc' } },
        (err, emotions) => {
            if (err) {
                res.status(500).send({ message: err.message });
                return;
            }
            const ret = {
                angry: 0,
                disgusted: 0,
                fearful: 0,
                happy: 0,
                neutral: 0,
                sad: 0,
                surprised: 0,
            };
            var numDoc = 0;
            emotions.forEach((emotion) => {
                for (var key in ret) {
                    if (ret.hasOwnProperty(key)) {
                        ret[key] += emotion[key];
                    }
                }
                numDoc++;
            });
            var maxEmo = ret.angry;
            var nameMaxEmo = "angry";
            for (const [key, value] of Object.entries(ret)) {
                if (value > maxEmo) {
                    nameMaxEmo = key;
                    maxEmo = value;
                }
            }
            for (var key in ret) {
                if (ret.hasOwnProperty(key)) {
                    ret[key] = Math.round(ret[key] * 100 / numDoc);
                }
            }
            res.send({
                total: numDoc,
                maxEmo: nameMaxEmo,
                summary: ret,
                details: emotions
            });
        }
    );
}

exports.last30days = (req, res, next) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Emotion.find(
        { date: { $gte: (dateUtils.getLast30Days(startOfToday).getTime() / 1000) } },
        { __v: 0 },
        { sort: { 'date': 'desc' } },
        (err, emotions) => {
            if (err) {
                res.status(500).send({ message: err.message });
                return;
            }
            const ret = {
                angry: 0,
                disgusted: 0,
                fearful: 0,
                happy: 0,
                neutral: 0,
                sad: 0,
                surprised: 0,
            };
            var numDoc = 0;
            emotions.forEach((emotion) => {
                for (var key in ret) {
                    if (ret.hasOwnProperty(key)) {
                        ret[key] += emotion[key];
                    }
                }
                numDoc++;
            });
            var maxEmo = ret.angry;
            var nameMaxEmo = "angry";
            for (const [key, value] of Object.entries(ret)) {
                if (value > maxEmo) {
                    nameMaxEmo = key;
                    maxEmo = value;
                }
            }
            for (var key in ret) {
                if (ret.hasOwnProperty(key)) {
                    ret[key] = Math.round(ret[key] * 100 / numDoc);
                }
            }
            res.send({
                total: numDoc,
                maxEmo: nameMaxEmo,
                summary: ret,
                details: emotions
            });
        }
    );
}

exports.year = (req, res, next) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), 1, 1);
    Emotion.find(
        { date: { $gte: (startOfToday.getTime() / 1000) } },
        { __v: 0 },
        { sort: { 'date': 'desc' } },
        (err, emotions) => {
            if (err) {
                res.status(500).send({ message: err.message });
                return;
            }
            const ret = {
                angry: 0,
                disgusted: 0,
                fearful: 0,
                happy: 0,
                neutral: 0,
                sad: 0,
                surprised: 0,
            };
            var numDoc = 0;
            emotions.forEach((emotion) => {
                for (var key in ret) {
                    if (ret.hasOwnProperty(key)) {
                        ret[key] += emotion[key];
                    }
                }
                numDoc++;
            });
            var maxEmo = ret.angry;
            var nameMaxEmo = "angry";
            for (const [key, value] of Object.entries(ret)) {
                if (value > maxEmo) {
                    nameMaxEmo = key;
                    maxEmo = value;
                }
            }
            for (var key in ret) {
                if (ret.hasOwnProperty(key)) {
                    ret[key] = Math.round(ret[key] * 100 / numDoc);
                }
            }
            res.send({
                total: numDoc,
                maxEmo: nameMaxEmo,
                summary: ret,
                details: emotions
            });
        }
    );
}