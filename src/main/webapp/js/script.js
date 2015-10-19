var filmsDivNominalHeight;

var categories = [];
var films = [];
var filmsCategory;
var aboutCategory;
var dataView;


function main() {
    initCategories();
    initDataView();
    hideAll();
    initSize();
    initHeader();
    initMenu();
    initInputFields();
    initSearchButton();

    aboutCategory.show();
    // getMoviesStub();

    $(document).tooltip({
        content: function(callback) { 
            callback($(this).prop('title').replace(/\||#END#/g, '<br />')); 
        }    
    });
}


var Film = function(film) {
    this.title              = film.title;
    this.director           = film.director;
    
    this.release            = film.release;
    this.country            = film.country;

    this.runtime            = film.runtime;
    this.genre              = film.genre;
    this.actors             = film.actors;
    this.plot               = film.plot;
    
    this.awards             = film.awards;
    this.metascore          = film.metascore;
    this.imdbRating         = film.imdbRating;
    this.imdbVotes          = film.imdbVotes;
    this.tomatoUserRating   = film.tomatoUserRating;
    this.tomatoUserReviews  = film.tomatoUserReviews;
    this.imdbUrl            = film.imdbUrl;
    this.tooltip  = '<b>'+this.title.toUpperCase() + '</b>||' +
                    '<i>Genre:</i> ' + this.genre + '|' +
                    '<i>Duration:</i> ' + this.runtime + '|' +
                    '<i>Release:</i> ' + this.release + '|' +
                    '<i>Country:</i> ' + this.country + '|' +
                    '<i>Starring:</i> ' + this.actors + '||' +
                    '<i>Plot:</i>|' +
                    "<font size=2>" + this.plot + '</font>';
                    if (this.awards != "N/A") {
                        this.tooltip += "||<b>AWARDS</b>|" + 
                            "<font size=2>" + this.awards + "</font>" + 
                            '#END#';
                    } else {
                        this.tooltip += '#END#';
                    }

    this.titleFull           = '<a href="' + this.imdbUrl +
                            '" target=_blank title="' + 
                            this.tooltip + '">' + this.title + '</a>';
}

var Category = function(categoryId, button) {
    var self = this;
    var hideSpeed = 200;
    var showDelay = 0;
    this.isCurrent = false;
    this.categoryId = categoryId;
    this.button = button;

    current: true;

    Category.prototype.show = function(how, delay) {
        this.categoryId.delay(delay).show(how);
        this.isCurrent = true;
    }

    Category.prototype.hide = function(how) {
        this.categoryId.hide(how, hideSpeed);
    }

    Category.prototype.setBtnPressed = function() {
        this.button.removeClass("menuItemPressed");
        this.button.addClass("menuItemPressed");
        this.button.removeClass("menuItem");
    }

    Category.prototype.setBtnReleased = function() {
        this.button.removeClass("menuItem");
        this.button.addClass("menuItem");
        this.button.removeClass("menuItemPressed");
    }

    this.button.click(function() {
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].categoryId.is(':visible')) {
                showDelay = hideSpeed;
            }
            if (categories[i] != self) {
                categories[i].hide("slide");
                categories[i].setBtnReleased();
            }
        }
        self.setBtnPressed();
        self.show("slide", showDelay);
    });
}

var DataView = function(frame, dataTable) {
    this.frame = frame;
    this.dataTable = dataTable;
    var self = this;

    DataView.prototype.show = function() {
        // self.hide();
        // self.hidePreload();
        this.frame.show();
        this.dataTable.show();
    }

    DataView.prototype.hide = function() {
        this.dataTable.hide();
        this.frame.hide();
    }

    DataView.prototype.init = function(items) {

        this.dataTable.DataTable({
            destroy: true,
            data: items,
            "bAutoWidth": false,
            "aoColumns": [
                { 
                    "data": "titleFull",
                    "render": function ( data, type, full, meta ) { 
                        return data;
                    },
                    "sWidth": "35%"
                },
                { 
                    "data": "director", 
                    "sWidth": "20%"
                },
                {
                    "data": "imdbRating",
                    "render": function ( data, type, full, meta ) {
                        return data+" / "+"10.0";
                    },
                    "sWidth": "10%"
                },
                { 
                    "data": "imdbVotes", 
                    "sWidth": "10%"
                },
                {
                    "data": "tomatoUserRating",
                    "render": function ( data, type, full, meta ) {
                        if (data === "0.0") {
                            return "N/A";
                        } else {
                            return data+" / 5.0";
                        }
                    },
                    "sWidth": "10%"
                },
                {
                    "data": "tomatoUserReviews",
                    "render": function ( data, type, full, meta ) {
                        if (data === "0") {
                            return "";
                        } else {
                            return data;
                        }
                    },
                    "sWidth": "10%"
                },
                {
                    "data": "metascore",
                    "render": function( data, type, full, meta ) {
                        if (data === "0") {
                            return "";
                        }
                        return data;
                    },
                    "sClass": "center",
                    "sWidth": "5%"
                }
            ],
            "columnDefs": [ 
                {
                    "targets": [0],
                    "createdCell": function (td, cellData, rowData, row, col) {
                        $(td).addClass('tableLink cl-effect-1');
                        if (rowData.imdbVotes > 1000) {
                            $(td).addClass('goodVotes');
                        } else {
                            $(td).addClass('lowVotes');
                        }
                        var end = '#END#">';
                        var content = cellData.substring(
                            cellData.indexOf(end) + end.length, 
                            cellData.indexOf("/a") - 2);
                        
                        if (content.length > 40) {
                            if (content.length > 50) {
                                $(td).css('font-size', '70%'); 
                            } else {
                                $(td).css('font-size', '80%');
                            }
                        }
                    }
                }
            ],
            "createdRow": function( row, data, dataIndex ) {
                if (data.imdbVotes < 1000) {
                    $(row).addClass('lowVotes');
                } else if (data.imdbVotes > 100000) {
                    $(row).css('font-weight', 'bold');
                }
            },
            "lengthMenu": [[10, 25, -1], [10, 25, "All"]]
        });
    }
}

function initCategories() {
    filmsCategory = new Category($("#searchByYear"), $("#filmsByYearBtn"));
    aboutCategory = new Category($("#about"), $("#aboutBtn"));
    categories.push(filmsCategory, aboutCategory);
}

function initDataView() {
    dataView = new DataView($("#films"), $("#filmsTable"));
}

function initSize() {
    var headerHeight = $("#header").height() +
        parseInt($("#header").css("margin-top"),10) + parseInt($("#header").css("margin-bottom"),10);
    var menuHeight = $("#menu").height() +
        parseInt($("#menu").css("margin-top"),10) + parseInt($("#menu").css("margin-bottom"),10);
    var aboutMargins = parseInt($("#about").css("margin-top"),10) + parseInt($("#about").css("margin-bottom"),10);
    var aboutPadding = parseInt($("#about").css("padding-top"),10) + parseInt($("#about").css("padding-bottom"),10);
    var aboutHeight = $("#about").height() + aboutMargins + aboutPadding;
    var footerHeight = $("#footer").height();
    var footerMargins = parseInt($("#footer").css("margin-top"),10) + parseInt($("#footer").css("margin-bottom"),10);
    var totalHeight = headerHeight + menuHeight + aboutHeight + footerHeight + footerMargins;
    var documentHeight = $(document).height();
    filmsDivNominalHeight = documentHeight - totalHeight - footerHeight;
    $("#films").height(filmsDivNominalHeight);

    $("#error").width($("#header").width());
    $("#nothing").width($("#header").width());
    $("#footer").width($("#header").width());
}

function getMoviesStub() {
    var items = [{"country":"India","tomatoUserRating":"0.0","director":"Sundar C.","release":"14 Jan 2003","tomatoUserMeter":"0","tomatoMeter":"0","tomatoUserReviews":"30","runtime":"160 min","imdbRating":"8.9","title":"Love is God","imdbVotes":"4724","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0367495\/","actors":"Kamal Haasan, Madhavan, Kiran Rathod, Nasser","plot":"Nalla Sivam and Anbarasu meet under different circumstances and their lives are changed as they take the journey of their life.","tomatoRating":"0.0","awards":"2 wins & 3 nominations.","tomatoReviews":"0","genre":"Adventure, Comedy, Drama","id":"tt0367495","metascore":"0"},{"country":"USA, New Zealand","tomatoUserRating":"3.7","director":"Peter Jackson","release":"17 Dec 2003","tomatoUserMeter":"86","tomatoMeter":"95","tomatoUserReviews":"34673141","runtime":"201 min","imdbRating":"8.9","title":"The Lord of the Rings: The Return of the King","imdbVotes":"1105226","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0167260\/","actors":"Noel Appleby, Ali Astin, Sean Astin, David Aston","plot":"Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.","tomatoRating":"8.7","awards":"Won 11 Oscars. Another 164 wins & 87 nominations.","tomatoReviews":"261","genre":"Adventure, Fantasy","id":"tt0167260","metascore":"94"},{"country":"Australia","tomatoUserRating":"0.0","director":"Georgina Willis","release":"23 May 2003","tomatoUserMeter":"0","tomatoMeter":"0","tomatoUserReviews":"0","runtime":"76 min","imdbRating":"8.8","title":"Watermark","imdbVotes":"2374","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0371392\/","actors":"Jai Koutrae, Sandra Stockley, Ruth McDonald, Ellouise Rothwell","plot":"One man, two women. Past and present collide. What happens when someone kills, but no-one is guilty?","tomatoRating":"0.0","awards":"N\/A","tomatoReviews":"0","genre":"Crime, Drama, Mystery","id":"tt0371392","metascore":"0"},{"country":"Italy","tomatoUserRating":"4.6","director":"Marco Tullio Giordana","release":"22 Jun 2003","tomatoUserMeter":"98","tomatoMeter":"95","tomatoUserReviews":"7566","runtime":"383 min","imdbRating":"8.5","title":"The Best of Youth","imdbVotes":"15551","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0346336\/","actors":"Luigi Lo Cascio, Alessio Boni, Sonia Bergamasco, Maya Sansa","plot":"An Italian epic that follows the lives of two brothers, from the 1960s to the 2000s.","tomatoRating":"8.4","awards":"27 wins & 17 nominations.","tomatoReviews":"62","genre":"Drama, Romance","id":"tt0346336","metascore":"89"},{"country":"South Korea","tomatoUserRating":"4.3","director":"Chan-wook Park","release":"21 Nov 2003","tomatoUserMeter":"94","tomatoMeter":"80","tomatoUserReviews":"130374","runtime":"120 min","imdbRating":"8.4","title":"Oldboy","imdbVotes":"320782","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0364569\/","actors":"Min-sik Choi, Ji-tae Yu, Hye-jeong Kang, Dae-han Ji","plot":"After being kidnapped and imprisoned for 15 years, Oh Dae-Su is released, only to find that he must find his captor in 5 days.","tomatoRating":"7.3","awards":"24 wins & 14 nominations.","tomatoReviews":"133","genre":"Drama, Mystery, Thriller","id":"tt0364569","metascore":"74"},{"country":"India","tomatoUserRating":"0.0","director":"Rajkumar Hirani","release":"19 Dec 2003","tomatoUserMeter":"0","tomatoMeter":"0","tomatoUserReviews":"0","runtime":"156 min","imdbRating":"8.4","title":"Munna Bhai M.B.B.S.","imdbVotes":"34008","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0374887\/","actors":"Sunil Dutt, Sanjay Dutt, Arshad Warsi, Gracy Singh","plot":"A gangster sets out to fulfill his father's dream of becoming a doctor.","tomatoRating":"0.0","awards":"17 wins & 29 nominations.","tomatoReviews":"0","genre":"Comedy, Drama","id":"tt0374887","metascore":"0"},{"country":"India","tomatoUserRating":"4.1","director":"Bala","release":"N\/A","tomatoUserMeter":"0","tomatoMeter":"0","tomatoUserReviews":"256","runtime":"157 min","imdbRating":"8.3","title":"Pithamagan","imdbVotes":"2169","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0376076\/","actors":"'Chiyaan' Vikram, Suriya, Laila, Sangeetha","plot":"A boy raised in a cemetary grows up with no social skills, and leads a turbulent life readjusting once he moves out of the cemetary.","tomatoRating":"0.0","awards":"9 wins & 1 nomination.","tomatoReviews":"0","genre":"Drama","id":"tt0376076","metascore":"0"},{"country":"Serbia and Montenegro","tomatoUserRating":"4.4","director":"Dusan Kovacevic","release":"21 May 2003","tomatoUserMeter":"0","tomatoMeter":"0","tomatoUserReviews":"241","runtime":"104 min","imdbRating":"8.3","title":"The Professional","imdbVotes":"3861","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0339535\/","actors":"Bora Todorovic, Branislav Lecic, Natasa Ninkovic, Dragan Jovanovic","plot":"Till recently an University professor, a bohemian writer, a member of Belgrade's intellectual circles and a passionate opponent of the Milosevic's regime, TEJA is today a manager of a big ...","tomatoRating":"0.0","awards":"5 wins & 2 nominations.","tomatoReviews":"0","genre":"Comedy, Drama","id":"tt0339535","metascore":"0"},{"country":"India","tomatoUserRating":"4.1","director":"Vishal Bhardwaj","release":"30 Jan 2004","tomatoUserMeter":"93","tomatoMeter":"0","tomatoUserReviews":"704","runtime":"132 min","imdbRating":"8.3","title":"Maqbool","imdbVotes":"4058","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0379370\/","actors":"Irrfan Khan, Tabu, Pankaj Kapur, Naseeruddin Shah","plot":"Macbeth meets the Godfather in present-day Bombay. The Scottish tragedy set in the contemporary underworld of India's commercial capital; two corrupt, fortune telling policemen take the ...","tomatoRating":"0.0","awards":"8 wins & 12 nominations.","tomatoReviews":"0","genre":"Crime, Drama","id":"tt0379370","metascore":"0"},{"country":"India","tomatoUserRating":"4.0","director":"Gunasekhar","release":"15 Jan 2003","tomatoUserMeter":"80","tomatoMeter":"0","tomatoUserReviews":"85","runtime":"170 min","imdbRating":"8.2","title":"Okkadu","imdbVotes":"3705","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0366840\/","actors":"Mahesh Babu, Bhoomika Chawla, Prakash Raj, Chandramohan","plot":"A Kabbadi player rescues a young woman from an unwanted marriage and hides her in his home.","tomatoRating":"0.0","awards":"10 wins.","tomatoReviews":"0","genre":"Action, Romance","id":"tt0366840","metascore":"0"},{"country":"Netherlands","tomatoUserRating":"0.0","director":"Marcel de Vré","release":"N\/A","tomatoUserMeter":"0","tomatoMeter":"0","tomatoUserReviews":"0","runtime":"124 min","imdbRating":"8.2","title":"Dat Dan Weer Wel","imdbVotes":"533","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0387272\/","actors":"Hans Teeuwen","plot":"N\/A","tomatoRating":"0.0","awards":"N\/A","tomatoReviews":"0","genre":"Comedy","id":"tt0387272","metascore":"0"},{"country":"USA","tomatoUserRating":"3.8","director":"Andrew Stanton","release":"30 May 2003","tomatoUserMeter":"86","tomatoMeter":"99","tomatoUserReviews":"33350936","runtime":"100 min","imdbRating":"8.2","title":"Finding Nemo","imdbVotes":"612794","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0266543\/","actors":"Albert Brooks, Ellen DeGeneres, Alexander Gould, Willem Dafoe","plot":"After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.","tomatoRating":"8.7","awards":"Won 1 Oscar. Another 46 wins & 50 nominations.","tomatoReviews":"253","genre":"Animation, Adventure, Comedy","id":"tt0266543","metascore":"90"},{"country":"USA","tomatoUserRating":"3.4","director":"Quentin Tarantino","release":"10 Oct 2003","tomatoUserMeter":"80","tomatoMeter":"85","tomatoUserReviews":"32554004","runtime":"111 min","imdbRating":"8.1","title":"Kill Bill: Vol. 1","imdbVotes":"666715","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0266697\/","actors":"Uma Thurman, Lucy Liu, Vivica A. Fox, Daryl Hannah","plot":"The Bride wakens from a four-year coma. The child she carried in her womb is gone. Now she must wreak vengeance on the team of assassins who betrayed her - a team she was once part of.","tomatoRating":"7.7","awards":"Nominated for 1 Golden Globe. Another 23 wins & 64 nominations.","tomatoReviews":"224","genre":"Action","id":"tt0266697","metascore":"69"},{"country":"South Korea","tomatoUserRating":"4.2","director":"Joon-ho Bong","release":"02 May 2003","tomatoUserMeter":"94","tomatoMeter":"89","tomatoUserReviews":"10117","runtime":"132 min","imdbRating":"8.1","title":"Memories of Murder","imdbVotes":"57150","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0353969\/","actors":"Kang-ho Song, Sang-kyung Kim, Roe-ha Kim, Jae-ho Song","plot":"In 1986, in the province of Gyunggi, in South Korea, a second young and beautiful woman is found dead, raped and tied and gagged with her underwear. Detective Park Doo-Man and Detective Cho...","tomatoRating":"7.8","awards":"13 wins & 3 nominations.","tomatoReviews":"36","genre":"Crime, Drama, Mystery","id":"tt0353969","metascore":"82"},{"country":"South Korea, Germany","tomatoUserRating":"4.2","director":"Ki-duk Kim","release":"28 May 2004","tomatoUserMeter":"93","tomatoMeter":"95","tomatoUserReviews":"28248","runtime":"103 min","imdbRating":"8.1","title":"Spring, Summer, Fall, Winter... and Spring","imdbVotes":"57271","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0374546\/","actors":"Yeong-su Oh, Ki-duk Kim, Young-min Kim, Jae-kyeong Seo","plot":"On an isolated lake, an old monk lives on a small floating temple. The wise master has also a young boy with him who learns to become a monk. And we watch as seasons and years pass by.","tomatoRating":"8.1","awards":"12 wins & 7 nominations.","tomatoReviews":"95","genre":"Drama","id":"tt0374546","metascore":"85"},{"country":"India","tomatoUserRating":"4.3","director":"Nikhil Advani","release":"28 Nov 2003","tomatoUserMeter":"92","tomatoMeter":"71","tomatoUserReviews":"30515","runtime":"186 min","imdbRating":"8.1","title":"Kal Ho Naa Ho","imdbVotes":"37387","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0347304\/","actors":"Shah Rukh Khan, Preity Zinta, Saif Ali Khan, Jaya Bhaduri","plot":"Naina, an introverted, perpetually depressed girl's life changes when she meets Aman. But Aman has a secret of his own which changes their lives forever. Embroiled in all this is Rohit, Naina's best friend who conceals his love for her.","tomatoRating":"7.2","awards":"32 wins & 39 nominations.","tomatoReviews":"7","genre":"Comedy, Drama, Romance","id":"tt0347304","metascore":"54"},{"country":"USA","tomatoUserRating":"3.9","director":"Gore Verbinski","release":"09 Jul 2003","tomatoUserMeter":"86","tomatoMeter":"79","tomatoUserReviews":"33121310","runtime":"143 min","imdbRating":"8.1","title":"Pirates of the Caribbean: The Curse of the Black Pearl","imdbVotes":"739383","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0325980\/","actors":"Johnny Depp, Geoffrey Rush, Orlando Bloom, Keira Knightley","plot":"Blacksmith Will Turner teams up with eccentric pirate +Captain+ Jack Sparrow to save his love, the governor's daughter, from Jack's former pirate allies, who are now undead.","tomatoRating":"7.1","awards":"Nominated for 5 Oscars. Another 31 wins & 76 nominations.","tomatoReviews":"208","genre":"Action, Adventure, Fantasy","id":"tt0325980","metascore":"63"},{"country":"India","tomatoUserRating":"4.0","director":"Chandra Prakash Dwivedi","release":"N\/A","tomatoUserMeter":"91","tomatoMeter":"0","tomatoUserReviews":"941","runtime":"188 min","imdbRating":"8.1","title":"Pinjar","imdbVotes":"1663","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0347779\/","actors":"Urmila Matondkar, Manoj Bajpayee, Sanjay Suri, Sandali Sinha","plot":"In the days leading up to Partition, a Hindu woman is abducted by a Muslim man. Soon, she finds herself not only forced into marriage, but living in a new country as the borders between India and Pakistan are drawn.","tomatoRating":"0.0","awards":"9 wins & 12 nominations.","tomatoReviews":"0","genre":"Drama","id":"tt0347779","metascore":"0"},{"country":"Denmark, Sweden, UK, France, Germany, Netherlands, Norway, Finland, Italy","tomatoUserRating":"4.0","director":"Lars von Trier","release":"23 Apr 2004","tomatoUserMeter":"90","tomatoMeter":"70","tomatoUserReviews":"54458","runtime":"178 min","imdbRating":"8.1","title":"Dogville","imdbVotes":"101525","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0276919\/","actors":"Nicole Kidman, Harriet Andersson, Lauren Bacall, Jean-Marc Barr","plot":"A woman on the run from the mob is reluctantly accepted in a small Colorado town. In exchange, she agrees to work for them. As a search visits town, she finds out that their support has a price. Yet her dangerous secret is never far away...","tomatoRating":"6.9","awards":"22 wins & 20 nominations.","tomatoReviews":"164","genre":"Crime, Drama, Thriller","id":"tt0276919","metascore":"59"},{"country":"India","tomatoUserRating":"4.3","director":"Sudhir Mishra","release":"15 Apr 2005","tomatoUserMeter":"91","tomatoMeter":"0","tomatoUserReviews":"262","runtime":"120 min","imdbRating":"8.0","title":"Hazaaron Khwaishein Aisi","imdbVotes":"3466","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0411469\/","actors":"Kay Kay Menon, Shiney Ahuja, Chitrangda Singh, Ram Kapoor","plot":"Geeta Rao has two admirers - one is Siddharth Tyabji and the other is Vikram Malhotra circa 1969 West Bengal that is witnessing it's struggle against the ruling Congress party, joining ...","tomatoRating":"0.0","awards":"2 wins & 5 nominations.","tomatoReviews":"0","genre":"Drama","id":"tt0411469","metascore":"0"},{"country":"USA","tomatoUserRating":"3.7","director":"Tim Burton","release":"09 Jan 2004","tomatoUserMeter":"89","tomatoMeter":"77","tomatoUserReviews":"496417","runtime":"125 min","imdbRating":"8.0","title":"Big Fish","imdbVotes":"334022","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0319061\/","actors":"Ewan McGregor, Albert Finney, Billy Crudup, Jessica Lange","plot":"A son tries to learn more about his dying father by reliving stories and myths he told about his life.","tomatoRating":"7.2","awards":"Nominated for 1 Oscar. Another 2 wins & 45 nominations.","tomatoReviews":"213","genre":"Adventure, Drama, Fantasy","id":"tt0319061","metascore":"58"},{"country":"Russia","tomatoUserRating":"3.9","director":"Andrey Zvyagintsev","release":"25 Jun 2003","tomatoUserMeter":"81","tomatoMeter":"0","tomatoUserReviews":"267","runtime":"105 min","imdbRating":"8.0","title":"The Return","imdbVotes":"29595","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0376968\/","actors":"Vladimir Garin, Ivan Dobronravov, Konstantin Lavronenko, Nataliya Vdovina","plot":"In the Russian wilderness, two brothers face a range of new, conflicting emotions when their father - a man they know only through a single photograph - resurfaces.","tomatoRating":"0.0","awards":"Nominated for 1 Golden Globe. Another 28 wins & 13 nominations.","tomatoReviews":"0","genre":"Drama, Mystery, Thriller","id":"tt0376968","metascore":"82"},{"country":"USA, Australia","tomatoUserRating":"3.7","director":"Clint Eastwood","release":"15 Oct 2003","tomatoUserMeter":"89","tomatoMeter":"87","tomatoUserReviews":"201569","runtime":"138 min","imdbRating":"8.0","title":"Mystic River","imdbVotes":"319522","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0327056\/","actors":"Sean Penn, Tim Robbins, Kevin Bacon, Laurence Fishburne","plot":"With a childhood tragedy that overshadowed their lives, three men are reunited by circumstance when one has a family tragedy.","tomatoRating":"7.7","awards":"Won 2 Oscars. Another 75 wins & 87 nominations.","tomatoReviews":"194","genre":"Crime, Drama, Mystery","id":"tt0327056","metascore":"84"},{"country":"Thailand","tomatoUserRating":"4.1","director":"Vitcha Gojiew","release":"N\/A","tomatoUserMeter":"0","tomatoMeter":"0","tomatoUserReviews":"755","runtime":"110 min","imdbRating":"8.0","title":"My Girl","imdbVotes":"902","imdbUrl":"http:\/\/www.imdb.com\/title\/tt0399040\/","actors":"Charlie Trairat, Focus Jirakul, Charwin Jitsomboon, Wongsakorn Rassamitat","plot":"Jeab hears that his childhood sweetheart Noi-Naa is to be married, so he makes the trip back home to his provincial village. As he does so, the memories come flooding back to his childhood ...","tomatoRating":"0.0","awards":"3 wins & 1 nomination.","tomatoReviews":"0","genre":"Comedy","id":"tt0399040","metascore":"0"}];

    var films = [];
    for (var i = 0; i < items.length; i++) {
        var film = new Film(items[i]);
        films[i] = film;
    }
    dataView.init(films);
    dataView.show();
}

function getMovies(request) {

    showPreload();

    $.ajax({
        url: "search",
        method: 'POST',
        data: request,
        error: function(jqXHR, textStatus, error) {
            showError(jqXHR.status, textStatus, error);
        },
        success: function( json ) {
            if (json.length == 0) {
                showNothing();
                return;
            }
            var films = [];
            for (var i = 0; i < json.length; i++) {
                var film = new Film(json[i]);
                films[i] = film;
            }
            dataView.init(films);
            dataView.show();
            hidePreload();
        }
    });
}

function initInputFields() {
    $("#dialogInvalidInput").hide();
    $("#inputYear").attr("min", 1900);
    $("#inputYear").attr("max", (new Date).getFullYear());
    var yTitle = $("#inputYear").attr("min") +
        " ... " + $("#inputYear").attr("max");
    $("#inputYear").attr("title", yTitle);
    $("#inputYear").val((new Date).getFullYear());
    $("#inputRating").val("8.0");
}

function isValidInput() {
    var minR = parseInt($("#inputRating").attr("min"),10);
    var maxR = parseInt($("#inputRating").attr("max"),10);
    var userR = parseInt($("#inputRating").val(),10);
    var isUserRatingLess = (userR < minR);
    var isUserRatingMore = (userR > maxR);

    var minY = parseInt($("#inputYear").attr("min"),10);
    var maxY = parseInt($("#inputYear").attr("max"),10);
    var userY = parseInt($("#inputYear").val(),10);
    var isUserYearLess = (userY < minY);
    var isUserYearMore = (userY > maxY);

    if (isUserYearLess || isUserYearMore ||
        isUserRatingLess || isUserRatingMore ||
        ($("#inputRating").val() === "") ||
        ($("#inputYear").val() === "")
    ) {
        return false;
    }
    return true;
}

function showAlertInvalidInput() {
    $("#dialogInvalidInput").dialog({
        // modal: true,
        closeOnEscape: false,
        draggable: false,
        resizable: false,
        open: function(event, ui) {
            setTimeout("$('#dialogInvalidInput').dialog('close')", 1000);
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        },
        hide: {
            effect: "fadeOut",
            duration: 1000
        }
    });
}

function initSearchButton() {
    $("#searchBtn").click(function() {

        if (isValidInput()) {
            getMovies(getUserInput());
        } else {
            showAlertInvalidInput();
        }
    });
}

function getUserInput() {
    var year = $("#inputYear").val();
    var rating = $("#inputRating").val();
    var genre = $("#inputGenres").val().split(" ")[0].toLowerCase().replace(/\*/g,"");
    var request = "year=" + year + "&minRating=" + rating + "&genre=" + genre;
    return request;
}

function showPreload() {
    $("#error").hide();
    dataView.hide();
    // $("#filmsTable").hide();
    // $("#films").hide();
    $("#nothing").hide();
    $("#preloader").show();
    // isLoading = true;
}

function hidePreload() {
    $("#preloader").hide();
    // isLoading = false;
}

function showError(status, textStatus, error) {
    $("#preloader").hide();
    $("#filmsTable").hide();
    $("#films").hide();
    $("#error").html("Something went wrong<br />" +
        "<b>"+status+"</b>: "+textStatus+": "+error+
        "<br/>You might try again");
    $("#error").show();
}

function showNothing() {
    $("#preloader").hide();
    $("#filmsTable").hide();
    $("#films").hide();
    $("#nothing").html('Nothing found. <span style="border-bottom: 1px dashed;">Nothing!</span> None.');
    $("#nothing").show();
}

function initMenu() {
    // var position = { my: 'center bottom-20', at: 'center top' };
    // position.collision = 'none';
    // $('#inputYear').tooltip();
    // $('#inputYear').tooltip('option', 'position', position);
    // $('#inputYear').tooltip('option', 'tooltipClass', 'top');
}

function initHeader() {
    $("#header").click(function() {
        location.reload();
    });

}


function showAll(how) {
    currentCategory.show(how);
    if (isLoading) {
        $("#preloader").show(how);
    } else if (isLoaded) {
        $("#films").show(how);
        $("#filmsTable").show(how);
    }
    isHidden = false;
}

function hideAll(how) {
    filmsCategory.hide(how);
    aboutCategory.hide(how);
    $("#films").hide(how);
    $("#error").hide(how);
    $("#filmsTable").hide(how);
    $("#preloader").hide(how);
    $("#dialogInvalidInput").hide(how);
    isHidden = true;
}

