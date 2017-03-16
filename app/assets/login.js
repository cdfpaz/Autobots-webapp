function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var LoginModalController = {
    tabsElementName: ".logmod__tabs li",
    tabElementName: ".logmod__tab",
    inputElementsName: ".logmod__form .input",
    hidePasswordName: ".hide-password",
    submitElementsName: ".logmod__form .simform__actions .sumbit",

    inputElements: null,
    tabsElement: null,
    tabElement: null,
    hidePassword: null,
    submitElements: null,

    activeTab: null,
    tabSelection: false, // false - first, true - second

    findElements: function () {
        var base = this;

        base.tabsElement = $(base.tabsElementName);
        base.tabElement = $(base.tabElementName);
        base.inputElements = $(base.inputElementsName);
        base.hidePassword = $(base.hidePasswordName);
        base.submitElements = $(base.submitElementsName);

        return base;
    },

    setState: function (state) {
    	var base = this,
            elem = null;

        if (!state) {
            state = 0;
        }

        if (base.tabsElement) {
        	elem = $(base.tabsElement[state]);
            elem.addClass("current");
            $("." + elem.attr("data-tabtar")).addClass("show");
        }

        return base;
    },

    getActiveTab: function () {
        var base = this;

        base.tabsElement.each(function (i, el) {
           if ($(el).hasClass("current")) {
               base.activeTab = $(el);
           }
        });

        return base;
    },

    addClickEvents: function () {
    	var base = this;

        base.submitElements.on("click", function (e) {
            e.preventDefault();
            $(".logmod__error").text("");
            $(".logmod__create-error").text("");

            if (base.tabSelection) {
                var emailCtrl = $("#user-create-email");
                var pwdCtrl = $("#user-create-pw");
                var pwdRepeatCtrl = $("#user-pw-repeat");

                if (!emailCtrl.val()) {
                    $(".logmod__create-error").text("Please fill your email, you must validate it");
                    emailCtrl.focus();
                    return;
                }

                if (!validateEmail(emailCtrl.val())) {
                    $(".logmod__create-error").text("Please enter a valid e-mail");
                    emailCtrl.focus();
                    return;
                }

                if (!pwdCtrl.val()) {
                    $(".logmod__create-error").text("Password cound not be empty");
                    pwdCtrl.focus();
                    return;
                }

                if (!pwdRepeatCtrl.val()) {
                    $(".logmod__create-error").text("Please confirm password");
                    pwdRepeatCtrl.focus();
                    return;
                }

                if (pwdRepeatCtrl.val() != pwdCtrl.val()) {
                    $(".logmod__create-error").text("Password confirmation is invalid");
                    pwdRepeatCtrl.focus();
                    return;
                }

                $.ajax({
                  type: "POST",
                  url: "/register",
                  dataType: 'json',
                  data: {'user' : emailCtrl.val(), 'pwd': pwdCtrl.val()},
                  success: function (data) {
                    console.log(data);
                  },
                  error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // something went wrong with the request
                    console.log(XMLHttpRequest.responseText);
                 }
                });

            }
            else {
                var emailCtrl = $("#user-email");
                var pwdCtrl = $("#user-pw");

                if (!emailCtrl.val()) {
                    $(".logmod__error").text("Please fill your email, you must validate it");
                    emailCtrl.focus();
                    return;
                }

                if ( !validateEmail(emailCtrl.val()) ) {
                    $(".logmod__error").text("Please type a valid e-mail");
                    emailCtrl.focus();
                    return;
                }

                if (!pwdCtrl.val()) {
                    $(".logmod__error").text("Password could not be empty");
                    pwdCtrl.focus();
                    return;
                }

                $.ajax({
                  type: "POST",
                  url: "/login",
                  dataType: 'json',
                  data: {'user' : emailCtrl.val(), 'pwd': pwdCtrl.val()},
                  success: function (data) {
                    if (data.result != "ok")
                    {
                        console.log("data return error");
                    }
                    else {
                        window.location.href = "/trading"
                    }
                  },
                  error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("error send request");
                 }
                });
            }
        });

        base.hidePassword.on("click", function (e) {
            var $this = $(this),
                $pwInput = $this.prev("input");

            if ($pwInput.attr("type") == "password") {
                $pwInput.attr("type", "text");
                $this.text("Hide");
            } else {
                $pwInput.attr("type", "password");
                $this.text("Show");
            }
        });

        base.tabsElement.on("click", function (e) {
            var targetTab = $(this).attr("data-tabtar");

            base.tabSelection = !base.tabSelection;

            e.preventDefault();
            base.activeTab.removeClass("current");
            base.activeTab = $(this);
            base.activeTab.addClass("current");

            base.tabElement.each(function (i, el) {
                el = $(el);
                el.removeClass("show");
                if (el.hasClass(targetTab)) {
                    el.addClass("show");
                }
            });
        });

        base.inputElements.find("label").on("click", function (e) {
           var $this = $(this),
               $input = $this.next("input");

            $input.focus();
        });

        return base;
    },

    initialize: function () {
        var base = this;

        base.findElements().setState().getActiveTab().addClickEvents();
    }
};


$(document).ready(function() {
  LoginModalController.initialize();
});
