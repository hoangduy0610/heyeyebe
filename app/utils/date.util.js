exports.getMonday = (d) => {
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

exports.getLast30Days = (d) => {
    var day = d.getDay(),
        diff = d.getDate() - 30;
    return new Date(d.setDate(diff));
}