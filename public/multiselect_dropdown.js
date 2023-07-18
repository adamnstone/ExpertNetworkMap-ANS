Array.prototype.search = function(elem) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == elem) return i;
    }

    return -1;
};

var Multiselect = function(selector, callback) {
    if (!$(selector)) {
        console.error("ERROR: Element %s does not exist.", selector);
        return;
    }

    this.selector = selector;
    this.selections = [];
    this.callback = callback;

    (function(that) {
        that.events(callback);
    })(this);
};

Multiselect.prototype = {
    open: function(that) {
        var target = $(that).parent().attr("data-target");

        // If we are not keeping track of this one's entries, then start doing so.
        if (!this.selections) {
            this.selections = [];
        }

        $(this.selector + ".multiselect").toggleClass("active");
    },

    close: function() {
        $(this.selector + ".multiselect").removeClass("active");
    },

    events: function(callback) { // Pass the callback function as an argument
        var that = this;

        $(document).on("click", that.selector + ".multiselect > .title", function(e) {
            if (e.target.className.indexOf("close-icon") < 0) {
                that.open();
            }
        });

        $(document).on("click", that.selector + ".multiselect > .title > .close-icon", function(e) {
            that.clearSelections();
        });


        $(document).on("click", that.selector + ".multiselect option", function(e) {
            var selection = $(this).attr("value");
            var optionsCount = $(that.selector + ".multiselect option").length;
            if (selection == "All") {
                if (that.selections.search("All") < 0) {
                    // Select All
                    that.selections = $(that.selector + ".multiselect option").map(function() {
                        return $(this).val();
                    }).get();
                } else {
                    // Deselect All
                    that.selections = [];
                }
            } else {
                var io = that.selections.search(selection);
                if (io < 0) that.selections.push(selection);
                else that.selections.splice(io, 1);
                // If not all options are selected, deselect "All"
                if (that.selections.length !== optionsCount && that.selections.search("All") >= 0) {
                    const res = that.selections.search("All");
                    if (res != -1) that.selections.splice(res, 1);
                }
                // If all options are selected, also select 'All'
                else if (that.selections.length === optionsCount - 1 && that.selections.search("All") < 0) {
                    that.selections.push('All');
                }
            }

            that.selectionStatus();
            that.setSelectionsString();
            if (typeof callback === "function") {
                callback(that.selections);
            }
        });
    },

    selectionStatus: function() {
        var obj = $(this.selector + ".multiselect");

        if (this.selections.length) obj.addClass("selection");
        else obj.removeClass("selection");
    },

    clearSelections: function() {
        this.selections = [];
        this.selectionStatus();
        this.setSelectionsString();
        this.callback([]);
    },

    getSelections: function() {
        return this.selections;
    },

    setSelectionsString: function() {
        var selects = this.getSelectionsString().split(", ");
        $(this.selector + ".multiselect > .title").attr("title", selects);

        var opts = $(this.selector + ".multiselect option");

        if (selects.toString().length > 16) {
            $(this.selector + ".multiselect > .title > .text")
                .text(selects.toString().slice(0, 16) + "...");
        } else {
            $(this.selector + ".multiselect > .title > .text")
                .text(selects);
        }

        for (var i = 0; i < opts.length; i++) {
            $(opts[i]).removeClass("selected");
        }
        console.log(selects);
        for (var j = 0; j < selects.length; j++) {
            var select = selects[j];
            for (var i = 0; i < opts.length; i++) {
                if ($(opts[i]).attr("value") == select || select == "All") {
                    $(opts[i]).addClass("selected");
                    if (select != "All") break;
                }
            }
        }
    },

    getSelectionsString: function() {
        // If "All" is selected, return "All"
        if (this.selections.search("All") >= 0)
            return "All";
        else if (this.selections.length > 0)
            return this.selections.join(", ");
        else return "Filter Labs";
    },

    setSelections: function(arr) {
        if (!arr[0]) {
            error("ERROR: This does not look like an array.");
            return;
        }

        this.selections = arr;
        this.selectionStatus();
        this.setSelectionsString();
    },
};

const initializeLabMultiselect = (labs, callback) => {
    $(document).ready(function() {
        var multi = new Multiselect("#countries", callback);
    });

    const select = d3.select("#my_dataviz").select("div div.container");

    select.selectAll("option")
        .data(["All"].concat(labs)) // Add "All" option to the start of the list
        .join("option")
        .attr("value", d => d)
        .html(d => d);
};