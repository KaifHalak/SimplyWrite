let menu_btn_container = document.querySelector(".menu-icon-container")
let menu_btn_icon = document.querySelector(".menu-icon")

menu_btn_container.addEventListener("mouseover",function(){
    menu_btn_icon.src = "Icons/left_arrow_orange_svg.svg"
})
menu_btn_container.addEventListener("mouseout",function(){
    menu_btn_icon.src = "Icons/left_arrow_svg.svg"
})

menu_btn_container.addEventListener("click",function(){
    chrome.storage.local.get(null,function(stored_data){
        stored_data["current_active_index"] = -1

        chrome.storage.local.set(stored_data,function(){
            window.location.href = "../main.html"
        })
    
    })
})
