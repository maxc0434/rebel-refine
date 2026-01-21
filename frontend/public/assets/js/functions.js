(function ($) {
    "use strict";
    $(window).on('load', function () {
        $('.preloader').fadeOut(1000);
        
        // lightcase 
        $('a[data-rel^=lightcase]').lightcase();
        
        //Member Filter Isotop
        // init Isotope
        var $grid = $('.grid-memberlist').isotope({
            itemSelector: '.filter-item',
            layoutMode: 'fitRows',
        });

        // filter functions
        var filterFns = {
            // show if name ends with -ium
            ium: function () {
                var name = $(this).find('.name').text();
                return name.match(/ium$/);
            }
        };
        // bind filter button click
        $('.button-group').on('click', '.filter-btn', function () {
            var filterValue = $(this).attr('data-filter');
            // use filterFn if matches value
            filterValue = filterFns[filterValue] || filterValue;
            $grid.isotope({
                filter: filterValue
            });
        });
        // change is-checked class on buttons
        $('.button-group').each(function (i, buttonGroup) {
            var $buttonGroup = $(buttonGroup);
            $buttonGroup.on('click', '.filter-btn', function () {
                $buttonGroup.find('.is-checked').removeClass('is-checked');
                $(this).addClass('is-checked');
            });
        });
    })

    $(document).ready(function () {

        /*==== header Section Start here =====*/
        $("ul>li>.submenu").parent("li").addClass("menu-item-has-children");
        // drop down menu width overflow problem fix
        $('ul').parent('li').on('hover', function () {
            var menu = $(this).find("ul");
            var menupos = $(menu).offset();
            if (menupos.left + menu.width() > $(window).width()) {
                var newpos = -$(menu).width();
                menu.css({
                    left: newpos
                });
            }
        });
        $('.menu li a').on('click', function (e) {
            var element = $(this).parent('li');
            if (screen.width < 992) {
                if (element.hasClass('open')) {
                    element.removeClass('open');
                    element.find('li').removeClass('open');
                    element.find('ul').slideUp(300, "swing");
                } else {
                    element.addClass('open');
                    element.children('ul').slideDown(300, "swing");
                    element.siblings('li').children('ul').slideUp(300, "swing");
                    element.siblings('li').removeClass('open');
                    element.siblings('li').find('li').removeClass('open');
                    element.siblings('li').find('ul').slideUp(300, "swing");
                }
            }
        })
        $('.ellepsis-bar').on('click', function (e) {
            var element = $('.header-top');
            if (element.hasClass('open')) {
                element.removeClass('open');
                element.slideUp(300, "swing");
                $('.overlayTwo').removeClass('active');
            } else {
                element.addClass('open');
                element.slideDown(300, "swing");
                $('.overlayTwo').addClass('active');
            }
        });
        $('.header-bar').on('click', function () {
            $(this).toggleClass('active');
            $('.menu').toggleClass('active');
        })

        // 
        $('.login').on('click', function () {
            $('.popuplogin').toggleClass('open');
            // e.stopPropagation()
        })
        // 
        $('.signup').on('click', function () {
            $('.popup').toggleClass('open');
            // e.stopPropagation()
        })
        $('.popup__close').on('click', function () {
            $('.popup, .popuplogin').removeClass('open');
            // e.stopPropagation()
        })

        //Header
        var fixed_top = $("header");
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > 300) {
                fixed_top.addClass("header-fixed fadeInUp");
            } else {
                fixed_top.removeClass("header-fixed fadeInUp");
            }
        });

        /*==== header Section End here =====*/

        // scroll up start here
        $(function () {
            $(window).on('scroll', function () {
                if ($(this).scrollTop() > 300) {
                    $('.scrollToTop').css({
                        'bottom': '2%',
                        'opacity': '1',
                        'transition': 'all .5s ease'
                    });
                } else {
                    $('.scrollToTop').css({
                        'bottom': '-30%',
                        'opacity': '0',
                        'transition': 'all .5s ease'
                    })
                }
            });

            //Click event to scroll to top
            $('a.scrollToTop').on('click', function () {
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
                return false;
            });
        });

        // wow animation
        // new WOW().init();

        //Counter up js
        $('.counter').counterUp({
            delay: 10,
            time: 2000
        });

        // Banner slider start here
        var swiper = new Swiper('.banner-slider', {
            slidesPerView: 1,
            spaceBetween: 0,
            speed: 1200,
            navigation: {
                nextEl: '.banner-slider-next',
                prevEl: '.banner-slider-prev',
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            loop: true
        });

        // blog slider start here
        var swiper = new Swiper('.blog-slider', {
            slidesPerView: 1,
            spaceBetween: 0,
            speed: 1200,
            navigation: {
                nextEl: '.blog-slider-next',
                prevEl: '.blog-slider-prev',
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            loop: true
        });



        //Price table active on hover
        // $('.price-item').on('mouseenter', function () {
        //     $(this).addClass('active').parent().siblings().find('.price-item').removeClass('active');
        // });


        // shop cart + - start here
        var CartPlusMinus = $('.cart-plus-minus');
        $(".qtybutton").on("click", function() {
            var $button = $(this);
            var oldValue = $button.parent().find("input").val();
            if ($button.text() === "+") {
                var newVal = parseFloat(oldValue) + 1;
            } else {
                if (oldValue > 0) {
                    var newVal = parseFloat(oldValue) - 1;
                } else {
                    newVal = 1;
                }
            }
            $button.parent().find("input").val(newVal);
        });

        // shop sidebar menu
        $(".shop-menu>li>ul").parent("li").addClass("catmenu-item-has-children");
        $('.shop-menu li a').on('click', function (e) {
            var element = $(this).parent('li');
            if (element.hasClass('open')) {
                element.removeClass('open');
                element.find('li').removeClass('open');
                element.find('ul').slideUp(300, "swing");
            } else {
                element.addClass('open');
                element.children('ul').slideDown(300, "swing");
                element.siblings('li').children('ul').slideUp(300, "swing");
                element.siblings('li').removeClass('open');
                element.siblings('li').find('li').removeClass('open');
                element.siblings('li').find('ul').slideUp(300, "swing");
            }
        })

        // product view mode change js
        $(function() {
            $('.product-view-mode').on('click', 'a', function (e) {
                e.preventDefault();
                var shopProductWrap = $('.shop-product-wrap');
                var viewMode = $(this).data('target');
                $('.product-view-mode a').removeClass('active');
                $(this).addClass('active');
                shopProductWrap.removeClass('grid list').addClass(viewMode);
            });
        });

        // model option start here
        $(function() {
            $('.view-modal').on('click', function () {
                $('.modal').addClass('show');
            });
            $('.close').on('click', function () {
                $('.modal').removeClass('show');
            });
        });
        // product single thumb slider
        $(function() {
            var galleryThumbs = new Swiper('.pro-single-thumbs', {
                spaceBetween: 10,
                slidesPerView: 3,
                loop: true,
                freeMode: true,
                loopedSlides: 1,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                navigation: {
                nextEl: '.pro-single-next',
                prevEl: '.pro-single-prev',
                },
            });
            var galleryTop = new Swiper('.pro-single-top', {
                spaceBetween: 10,
                loop:true,
                loopedSlides: 1,
                thumbs: {
                    swiper: galleryThumbs,
                },
            });
        });
        
        //Review Tabs
        $('ul.review-nav').on('click', 'li', function (e) {
            e.preventDefault();
            var reviewContent = $('.review-content');
            var viewRev = $(this).data('target');
            $('ul.review-nav li').removeClass('active');
            $(this).addClass('active');
            reviewContent.removeClass('review-content-show description-show').addClass(viewRev);
        });


    });
    
    //Odometer
    $(".app__content ul li").each(function () {
        $(this).isInViewport(function (status) {
        if (status === "entered") {
            for (var i = 0; i < document.querySelectorAll(".odometer").length; i++) {
            var el = document.querySelectorAll('.odometer')[i];
            el.innerHTML = el.getAttribute("data-odometer-final");
            }
        }
        });
    });


    // ajax contact form
    $(document).ready(function () {
        $(function () {
        var form = $("#commentform");
        var formMessages = $(".form-message");
        $(form).submit(function (e) {
            e.preventDefault();
            var formData = $(form).serialize();
            $.ajax({
            type: "POST",
            url: $(form).attr("action"),
            data: formData,
            })
            .done(function (response) {
                $(formMessages).removeClass("error");
                $(formMessages).addClass("success");
                $(formMessages).text(response);
                $("#commentform input, #commentform textarea").val("");
            })
            .fail(function (data) {
                $(formMessages).removeClass("success");
                $(formMessages).addClass("error");
                if (data.responseText !== "") {
                $(formMessages).text(data.responseText);
                } else {
                $(formMessages).text(
                    "Oops! An error occured and your message could not be sent."
                );
                }
            });
        });
        });
    });

    

}(jQuery));