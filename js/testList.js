$(document).ready(function () {
    var list = new List('media', 'content'),
        entries = [],
        i = 0,
        maxEntryCnt = 300;

    for (i; i < maxEntryCnt; i++) {
        var entry = [];
        entry.id = i;
        entry.name = 'testEntry' + i;
        entries.push(entry);
    }

    list.add(entries);

    $('#next').click(function () {
        list.next();
    });
    $('#prev').click(function () {
        list.prev();
    });
    $('#next3').click(function () {
        list.next(3);
    });
    $('#prev3').click(function () {
        list.prev(3);
    });
    $('#next5nw').click(function () {
        list.next(5, false);
    });
    $('#prev5nw').click(function () {
        list.prev(5, false);
    });
    $('#jump').click(function () {
        list.jump('media-list-entry-123');
    });
    $('#empty').click(function () {
        list.empty();
    });
});
