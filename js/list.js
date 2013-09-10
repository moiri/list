function List(id, parentId) {
    var me = this;
    me.id = id + '-list';
    me.contId = me.id + '-cont';
    me.markerId = me.id + '-marker';
    me.parentId = parentId;
    me.listContHeight;
    me.$curr = [];

    this.add = function (entries) {
        var entry = null;
        for (idx in entries) {
            entry = entries[idx];
            $('#' + me.contId)
                .append('<div id="' + me.id + '-entry-' + entry.id + '"'
                    + ' class="list-entry">' + entry.name + '</div>');
        }
        $('#' + me.contId + '>:last-child').css('border-bottom', 'none');
        me.$curr = $('#' + me.contId + '>:first-child');
        me.$curr.addClass('active');
    };

    this.empty = function () {
        $('#' + me.id).empty()
    };

    this.first = function () {
        me.$curr.removeClass('active');
        me.$curr = $('#' + me.contId + '>:first-child');
        me.$curr.addClass('active');
        me.positionList();
    };

    this.jump = function (id) {
        me.$curr.removeClass('active');
        $newEntry = $('#' + id);
        if ($newEntry.length > 0) {
            me.$curr = $newEntry;
        }
        else console.log('unknown list entry id: ' + id);
        me.$curr.addClass('active');
        me.positionList();
    };

    this.last = function () {
        me.$curr.removeClass('active');
        me.$curr = $('#' + me.contId + '>:last-child');
        me.$curr.addClass('active');
        me.positionList();
    };

    this.move = function (elemStr, step, wrap) {
        var $newEntry = me.$curr,
            i = 0,
            endElem = 'last',
            startElem = 'first';
        if (step === undefined) step = 1;
        else if (step === 'page') {
            step = Math.floor(
                    $('#' + me.id).height() / me.$curr.outerHeight()) - 1;
        }
        if (wrap === undefined) wrap = true;
        me.listContHeight = $('#' + me.contId).outerHeight();
        me.$curr.removeClass('active');
        if (elemStr === 'prev') {
            endElem = 'first';
            startElem = 'last';
        }

        for (i; i<step; i++) {
            if (elemStr === 'prev') $newEntry = $newEntry.prev();
            else $newEntry = $newEntry.next();
        }
        if ($newEntry.length > 0) {
            me.$curr = $newEntry;
        }
        else if (me.$curr.is('#' + me.contId + '>:' + endElem + '-child')) {
            if (wrap) {
                me.$curr = $('#' + me.contId + '>:' + startElem + '-child');
            }
        }
        else {
            me.$curr = $('#' + me.contId + '>:' + endElem + '-child');
        }
        me.$curr.addClass('active');
        me.positionList();
    };

    this.next = function (step, wrap) {
        me.move('next', step, wrap);
    };

    this.pageDown = function () {
        me.next('page', false);
    };

    this.pageUp = function () {
        me.prev('page', false);
    };

    this.prev = function (step, wrap) {
        me.move('prev', step, wrap);
    };

    me.positionList = function () {
        var listHeight = $('#' + me.id).height(),
            listContHeight = $('#' + me.contId).height(),
            currentHeight = me.$curr.outerHeight(),
            currentTop = me.$curr.position().top,
            currentBottom = listContHeight - me.$curr.position().top,
            midListPosition
                = ($('#' + me.id).outerHeight() - currentHeight) / 2;
        if (midListPosition > currentTop) {
            // moving active element above the middle
            $('#' + me.contId).css('top', 0);
        }
        else if (midListPosition > (currentBottom - currentHeight)) {
            // moving active element below the middle
            $('#' + me.contId).css('top', listHeight - listContHeight);
        }
        else {
            // active element is static, move list
            $('#' + me.contId).css('top', midListPosition - currentTop);
        }
    };

    this.registerKeyEvents = function () {
        $(document).keydown( function (event) {
            if (event.keyCode === 40) me.next();          // arrowDown
            else if (event.keyCode === 38) me.prev();     // arrowUp
            else if (event.keyCode === 34) me.pageDown(); // pageDown
            else if (event.keyCode === 33) me.pageUp();   // pageUp
            else if (event.keyCode === 36) me.first();    // Home
            else if (event.keyCode === 35) me.last();     // End
        });
    };

    this.registerTouchEvents = function () {
        $('.list-entry').bind("touchstart", function () {
            $('.list-entry').removeClass('active');
            $(this).addClass('active');
        });
        $('.list-entry').bind("touchmove", function () {
            $(this).removeClass('active');
        });
    };

    this.setup = function () {
        $('#' + me.parentId)
            .append('<div id="' + me.id + '" class="list"></div>');
        $('#' + me.id)
            .append('<div id="' + me.contId + '" class="list-cont"></div>');
        me.registerKeyEvents();
        me.registerTouchEvents();
    };

    this.setup();
}
