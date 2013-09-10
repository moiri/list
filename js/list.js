function List(id, parentId) {
    var me = this;
    me.id = id + '-list';
    me.contId = me.id + '-cont';
    me.parentId = parentId;

    this.add = function (entries) {
        var entry = null;
        for (idx in entries) {
            entry = entries[idx];
            $('#' + me.contId)
                .append('<div id="' + me.id + '-entry-' + entry.id + '"'
                    + ' class="list-entry">' + entry.name + '</div>');
        }
        $('#' + me.contId + '>:last-child').css('border-bottom', 'none');
        me.first();
        if ($('#' + me.id).height() > $('#' + me.contId).outerHeight()) {
            $('#' + me.id).css('bottom','auto');
        }
        else {
            $('#' + me.id).css('bottom','');
        }
        me.registerTouchEvents();
        me.registerMouseEvents();
    };

    this.empty = function () {
        $('#' + me.id).empty()
    };

    this.first = function () {
        me.unselect();
        me.select($('#' + me.contId + '>:first-child'), true);
    };

    this.jump = function (id, animate) {
        var $elem = $('#' + id);
        if (animate === undefined) animate = false;
        me.unselect();
        if ($elem.length > 0) {
            me.select($elem, animate);
        }
        else {
            console.log('unknown list entry id: ' + id);
        }
    };

    this.last = function () {
        me.unselect();
        me.select($('#' + me.contId + '>:last-child'), true);
    };

    this.move = function ($elem, elemStr, step, wrap) {
        var $newElem = $elem,
            i = 0,
            endElem = 'last',
            startElem = 'first';
        if (step === undefined) step = 1;
        else if (step === 'page') {
            step = Math.floor(
                    $('#' + me.id).height() / $elem.outerHeight()) - 1;
        }
        if (wrap === undefined) wrap = true;
        me.listContHeight = $('#' + me.contId).outerHeight();
        if (elemStr === 'prev') {
            endElem = 'first';
            startElem = 'last';
        }

        for (i; i<step; i++) {
            if (elemStr === 'prev') $newElem = $newElem.prev();
            else $newElem = $newElem.next();
        }
        if ($newElem.length > 0) {
            return $newElem;
        }
        else if ($elem.is('#' + me.contId + '>:' + endElem + '-child')) {
            if (wrap) {
                return $('#' + me.contId + '>:' + startElem + '-child');
            }
            else {
                return $('#' + me.contId + '>:' + endElem + '-child');
            }
        }
        else {
            return $('#' + me.contId + '>:' + endElem + '-child');
        }
    };

    this.next = function (step, wrap) {
        me.select(me.move(me.unselect(), 'next', step, wrap));
    };

    this.pageDown = function () {
        me.next('page', false);
    };

    this.pageUp = function () {
        me.prev('page', false);
    };

    this.prev = function (step, wrap) {
        me.select(me.move(me.unselect(), 'prev', step, wrap));
    };

    me.updatePositionSelectEntry = function ($elem, animate) {
        var listHeight = $('#' + me.id).height(),
            listContHeight = $('#' + me.contId).height(),
            currentHeight = $elem.outerHeight(),
            currentTop = $elem.position().top,
            currentBottom = listContHeight - currentTop,
            midListPosition
                = ($('#' + me.id).outerHeight() - currentHeight) / 2,
            newPosition = 0;
        if (midListPosition > currentTop) {
            // moving active element above the middle
            newPosition = 0;
        }
        else if (midListPosition > (currentBottom - currentHeight)) {
            // moving active element below the middle
            newPosition = listHeight - listContHeight;
        }
        else {
            // active element is static, move list
            newPosition = midListPosition - currentTop;
        }
        if (animate)
            $('#' + me.contId).animate({'top': newPosition});
        else
            $('#' + me.contId).css('top', newPosition);
    };

    this.registerMouseEvents = function () {
        $('[id|="' + me.id+ '-entry"]').unbind('click');
        $('[id|="' + me.id+ '-entry"]').click(function () {
            me.unselect();
            me.select($(this), true);
        });
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
        $('[id|="' + me.id+ '-entry"]').unbind('touchstart');
        $('[id|="' + me.id+ '-entry"]').bind('touchstart', function () {
            me.unselect();
            $(this).addClass('active');
        });
        $('[id|="' + me.id+ '-entry"]').unbind('touchmove');
        $('[id|="' + me.id+ '-entry"]').bind('touchmove', function () {
            me.unselect();
        });
    };

    this.select = function ($elem, animate) {
        if (animate === undefined) animate = false;
        $elem.addClass('active');
        me.updatePositionSelectEntry($elem, animate);
    };

    this.setup = function () {
        $('#' + me.parentId)
            .append('<div id="' + me.id + '" class="list"></div>');
        $('#' + me.id)
            .append('<div id="' + me.contId + '" class="list-cont"></div>');
        me.registerKeyEvents();
    };

    this.unselect = function () {
        var $elem = $('.list-entry.active');
        $elem.removeClass('active');
        return $elem;
    };

    this.setup();
}
