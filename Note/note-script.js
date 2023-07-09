// Elements

let note_title = document.querySelector(".note-title p")
let note_text_area = document.querySelector(".text-area")

let back_to_menu_icon = document.querySelector(".hamburger-menu img")

// Icons

const BACK_TO_MENU_ICON = "Icons/left_arrow_svg.svg"
const BACK_TO_MENU_ICON_HOVER = "Icons/left_arrow_orange_svg.svg"

// Default Values

var current_active_index = -1

const BACK_TO_MENU = `../main.html`



let StoredData = {
    data:{},
    GetData : function(){
        return this.data
    },
    SetData : function(data){
        this.data = data
    },
    GetTitle : function(){
        return this.data["notes"][current_active_index]["title"]
    },
    GetContent : function(){
        return this.data["notes"][current_active_index]["content"]
    },
    GetCurrentActiveIndex : function(){
        return this.data["current_active_index"]
    },
    SetActiveCurrentIndexToDefault : function(){
        this.data["current_active_index"] = -1
        StoreDataToChrome()
    },
    SetNewTitle : function(new_title){
        this.data["notes"][current_active_index]["title"] = new_title
        StoreDataToChrome()
    },
    SetNewContent : function(new_content){
        this.data["notes"][current_active_index]["content"] = new_content
        StoreDataToChrome()
    }
}


RetrieveDataFromChrome()


function RetrieveDataFromChrome(){
    chrome.storage.local.get(null,function(stored_data){
        StoredData.SetData(data = stored_data)
        current_active_index = StoredData.GetCurrentActiveIndex()
        UpdateTheElements()
        Initialize()
        note_text_area.focus()
    })
}


function Initialize(){

    note_title.addEventListener("input",function(){
        let title = note_title.innerHTML
        StoredData.SetNewTitle(title)
    })

    note_title.addEventListener("keydown",function(keypress){
        let enter_key_code = 13
        if (keypress.keyCode === enter_key_code){
            note_title.blur()
        }
    })

    note_text_area.addEventListener("input",function(event){
        let content = note_text_area.innerHTML
        StoredData.SetNewContent(content)
    })

    back_to_menu_icon.addEventListener("click",function(){
        StoredData.SetActiveCurrentIndexToDefault()
        window.location.href = BACK_TO_MENU
    })

    back_to_menu_icon.addEventListener("mouseover",function(){
        back_to_menu_icon.src = BACK_TO_MENU_ICON_HOVER
    })

    back_to_menu_icon.addEventListener("mouseout",function(){
        back_to_menu_icon.src = BACK_TO_MENU_ICON
    })
}


function UpdateTheElements(){
    let title = StoredData.GetTitle()
    let content = StoredData.GetContent()

    note_title.innerHTML = title
    note_text_area.innerHTML = content
}

function StoreDataToChrome(){
    let stored_data = StoredData.GetData()
    chrome.storage.local.set(stored_data)
}