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

            if (base.tabSelection) {
                var tabCtrl = $(".logmod .logmod__tab.lgm-1");
                var emailCtrl = tabCtrl.find("#user-email");
                var pwdCtrl = tabCtrl.find("#user-pw");
                var pwdRepeatCtrl = tabCtrl.find("#user-pw-repeat");

                if (!emailCtrl.val() || !validateEmail(emailCtrl.val())) {
                    emailCtrl.focus();
                    $( "#dialog-message" ).dialog("open");
                    return;
                }

                if (!pwdCtrl.val()) {
                    pwdCtrl.focus();
                    $( "#dialog-message" ).dialog("open");
                    return;
                }

                if (!pwdRepeatCtrl.val()) {
                    pwdRepeatCtrl.focus();
                    $( "#dialog-message" ).dialog("open");
                    return;
                }

                if (pwdRepeatCtrl.val() != pwdCtrl.val()) {
                    pwdRepeatCtrl.focus();
                    $( "#dialog-message" ).dialog("open");
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
                var tabCtrl = $(".logmod .logmod__tab.lgm-2");
                var emailCtrl = tabCtrl.find("#user-email");
                var pwdCtrl = tabCtrl.find("#user-pw");

                if (!emailCtrl.val() || !validateEmail(emailCtrl.val())) {
                    emailCtrl.focus();
                    $( "#dialog-message" ).dialog("open");
                    return;
                }

                if (!pwdCtrl.val()) {
                    pwdCtrl.focus();
                    $( "#dialog-message" ).dialog("open");
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
                        $( "#dialog-message" ).dialog("open");
                    }
                    else {
                        window.location.href = "/trading"
                    }
                  },
                  error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $( "#dialog-message" ).dialog("open");
                 }
                });

            }
        });

        base.hidePassword.on("click", function (e) {
            var $this = $(this).prev("input"),
                $pwInput = $this.prev("input");
e
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

  $("#dialog-message").dialog({
    autoOpen : false, modal : true, show : "blind", hide : "blind",
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
  });


    LoginModalController.initialize();
});
