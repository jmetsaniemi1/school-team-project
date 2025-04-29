AOS.init({
    offset: 120,
    duration: 1000
});

$(document).ready(function(){
    $(' .sidenav').sidenav();
    $('.dropdown-trigger').dropdown({
        alignment: 'left',
        inDuration: 300,
        outDuration: 225,
        coverTrigger: false,
        constrainWidth: false,
        closeOnClick: true
      });
    $(" .materialboxed").materialbox();
});