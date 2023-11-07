$(document).ready(()=>{
    $('#fp').click(()=>{
        $('#first-div').show();
        $('#first-second').hide();
    });
    
    $('#sp').click(()=>{
        $('#first-div').hide();
        $('#first-second').show();
    });
    $('#first-second').hide();
    
});
function myFunction() {
    let x = document.getElementById("zaki");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
    
}
function myFunction1() {
    let x = document.getElementById("zaki2");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
    
}
