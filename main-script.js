// Icons

let add_new_note_icon = document.querySelector(".add-new-note")
let delete_all_notes_icon = document.querySelector(".delete-all")

const EDIT_TITLE_ICON = "Icons/pen_svg.svg"
const EDIT_TITLE_ICON_HOVER = "Icons/pen_orange_svg.svg"

const DELETE_NOTE_ICON = "Icons/dustbin_svg.svg"
const DELETE_NOTE_ICON_HOVER = "Icons/dustbin_red_svg.svg"

// Default Values

const DEFAULT_TITLE = "Untitled"
const STORED_DATA_FORMAT = {
    "notes":{},
    "current_active_index":-1,
    "next_index":1
}

const NOTE_TAKING_HTML_LINK = `Note/note.html`

const CONFIRM_MESSAGE_FOR_DELETE_ALL = "Are you sure you want to delete all?"
const CONFIRM_MESSAGE_FOR_SINGLE_DELETE = "Are you sure you want to delete it?"

let StoredData = {
    data : STORED_DATA_FORMAT,
    GetData : function(){
        return this.data
    },
    SetData : function(new_data){
        this.data = new_data
    },
    GetNextID : function(){
        let next_id =  this.data["next_index"]
        this.data["next_index"] = this.data["next_index"] + 1
        return next_id
    },
    GetCurrentActiveIndex : function(){
        return this.data["current_active_index"]
    },
    GetNotes : function(){
        return this.data["notes"]
    },
    GetTitle : function(title_id){
        return this.data["notes"][title_id]["title"]
    },
    AddNewTitle : function(title_id){
        this.data["notes"][title_id] = {"title":DEFAULT_TITLE,"content":""}
    },
    UpdateTitle : function(title_id, new_title){
        this.data["notes"][title_id]["title"] = new_title
    },
    DeleteNote : function(title_id){
        delete this.data["notes"][title_id]
    },
    DeleteAllNotes: function(){
        this.data["notes"] = {}
        this.data["next_index"] = 1
    },
    SetCurrentActiveID : function(new_index){
        this.data["current_active_index"] = new_index
    }
}

let LoadedNoteTitles = {
    html:{},
    GetAllTitleHTMLs : function(){
        return this.html
    },
    AddHTML : function(title_id,html){
        this.html[title_id] = html
        LoadedNoteTitles.InitElement(title_id = title_id)
    },
    GetTitleInstance : function(title_id){
        return this.html[title_id].querySelector(".title p")
    },
    GetTitleParent : function(title_id){
        return this.html[title_id]
    },
    InitElement : function(title_id){
        let title_instance = LoadedNoteTitles.GetTitleInstance(title_id = title_id)

        title_instance.addEventListener("blur",function(){
            title_instance.contentEditable = false
            LoadedNoteTitles.StoreUpdatedTitle(title_id = title_id)

        })

        title_instance.addEventListener("keydown",function(key_press){
            let enter_key_code = 13
            if (key_press.keyCode === enter_key_code){
                title_instance.contentEditable = false
                LoadedNoteTitles.StoreUpdatedTitle(title_id = title_id)
            }
        })

    },
    StoreUpdatedTitle : function(title_id){
        let title_instance = LoadedNoteTitles.GetTitleInstance(title_id = title_id)
        let title = title_instance.innerHTML
        StoredData.UpdateTitle(title_id = title_id, new_title = title)
        StoreDataToChrome()
    },
    EnableContentEditable : function(title_id){
        let title_instance = LoadedNoteTitles.GetTitleInstance(title_id = title_id)
        title_instance.contentEditable = true
        title_instance.focus()
    },
    DeleteHTML : function(title_id){
        let title_parent = LoadedNoteTitles.GetTitleParent(title_id = title_id)
        title_parent.remove()
    },
    DeleteAllHTMLs : function(){
        let all_titles = LoadedNoteTitles.GetAllTitleHTMLs()
        Object.keys(all_titles).forEach(function(title_id){
            LoadedNoteTitles.DeleteHTML(title_id = title_id)
        })
        this.html = {}
    }
}

// BackEnd

RetrieveDataFromChrome()

function RetrieveDataFromChrome(){
    chrome.storage.local.get(null,function(stored_data){
        if (Object.keys(stored_data).length > 0){
            StoredData.SetData(stored_data)
            let current_active_index = StoredData.GetCurrentActiveIndex()
            if (current_active_index !== -1){
                window.location.href = NOTE_TAKING_HTML_LINK
            }
            DisplayLoadedData()
        }
        InitValues()
    })
}

function InitValues(){
    add_new_note_icon.addEventListener("click",function(){
        let title_id = StoredData.GetNextID()
        let title = DEFAULT_TITLE
        AddNewNote(title_id = title_id, title = title)
        StoredData.AddNewTitle(title_id = title_id)
        EditNoteTitle(title_id)
        StoreDataToChrome()
    })
    delete_all_notes_icon.addEventListener("click",function(){
        let confirm_message = CONFIRM_MESSAGE_FOR_DELETE_ALL
        let flag = confirm(confirm_message)
        if (flag){
            DeleteAllNotes()
        }

    })
}

function DisplayLoadedData(){
    let all_notes = StoredData.GetNotes()
    Object.keys(all_notes).forEach(function(title_id){
        let title = StoredData.GetTitle(title_id = title_id)
        AddNewNote(title_id = title_id, title = title)
    })
    
}

function AddNewNote(title_id, title){

    // Adding the HTML content 

    let newDiv = document.createElement("div")
    newDiv.classList.add("note")

    newDiv.innerHTML = `  
    <div class="title">
        <p contenteditable="false" spellcheck="false" class="text">${title}</p>
    </div>

    <div class="extras">
        <img src=${EDIT_TITLE_ICON} alt="edit title note" class="icon pen" title = "Edit Title" draggable="false">
        <img src=${DELETE_NOTE_ICON} alt="delete note" class="icon delete" title = "Delete Note" draggable="false">
    </div>
    `
    let parentNode = document.querySelector(".note-list")
    parentNode.append(newDiv)

    // Saving this new change

    LoadedNoteTitles.AddHTML(title_id = title_id, html = newDiv)
    


    // Adding listeners

    let edit_title_icon = newDiv.querySelector(".pen")
    let delete_note_icon = newDiv.querySelector(".delete")
    let title_parent = newDiv.querySelector(".title")
    let title_parent_p_tag = newDiv.querySelector(".title p")

    edit_title_icon.addEventListener("click",function(){
        EditNoteTitle(title_id = title_id)
    })

    edit_title_icon.addEventListener("mouseover",function(){
        edit_title_icon.src = EDIT_TITLE_ICON_HOVER
    })

    edit_title_icon.addEventListener("mouseout",function(){
        edit_title_icon.src = EDIT_TITLE_ICON
    })

    delete_note_icon.addEventListener("click",function(){
        let confirm_message = CONFIRM_MESSAGE_FOR_SINGLE_DELETE
        let flag = confirm(confirm_message)
        if (flag){
            DeleteNote(title_id = title_id)
        }
    })

    delete_note_icon.addEventListener("mouseover", function(){
        delete_note_icon.src = DELETE_NOTE_ICON_HOVER
    })

    delete_note_icon.addEventListener("mouseout",function(){
        delete_note_icon.src = DELETE_NOTE_ICON
    })

    title_parent.addEventListener("click",function(){
        if (document.activeElement !== title_parent_p_tag){
            let current_active_index = Number(title_id)
            StoredData.SetCurrentActiveID(new_index = current_active_index)
            StoreDataToChrome()
            window.location.href = NOTE_TAKING_HTML_LINK
        }
    })
}

function EditNoteTitle(title_id){
    LoadedNoteTitles.EnableContentEditable(title_id = title_id)
}

function DeleteAllNotes(){
    LoadedNoteTitles.DeleteAllHTMLs()
    StoredData.DeleteAllNotes()
    StoreDataToChrome()

}

function DeleteNote(title_id){
    LoadedNoteTitles.DeleteHTML(title_id = title_id)
    StoredData.DeleteNote(title_id = title_id)
    StoreDataToChrome()
}

function StoreDataToChrome(){
    chrome.storage.local.set(StoredData.GetData())
}

