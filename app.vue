<template>
  <div v-if="!editMode" class="screen">
    <div class="gap flex-col form">

      <h1 style="margin:auto;text-align: center;margin-bottom: 1em">IcoDesk<br/>Configurator<span
          :style="{visibility: underlineVisible ? 'visible' : 'hidden'}">_</span></h1>
      <p style="margin:0;text-align: center">Geräte-ID:</p>
      <input v-model="id" style="text-align:center" placeholder="ID eingeben"/>
      <button class="eightbit-btn" @click="edit()">Konfigurieren &gt;</button>
    </div>
  </div>
  <div v-else>
    <nav class="top">
      <button class="eightbit-btn eightbit-btn--proceed" style="filter:saturate(0) brightness(.9)" @click="editMode=false">&lt; Zurück</button>
      <h1>Geräte-ID: {{ id }}</h1>
        <button :class="{'eightbit-btn':true, 'eightbit-btn--proceed':unsavedChanges}" @click="storeConfig()">{{ speichernText }}</button>
    </nav>

    <main>
      <aside v-if="modules.length">
        <h2>Farben</h2>
        <div v-if="config?.colors" v-for="color in config.colors">
          <input v-model="color.hex" @change="drawModule()" type="color"/>
          {{ color.name }}
        </div>
        <h2>Module</h2>
        <div class="flex-col module" @mouseover="tryPreview(module.name)" v-if="config?.modules.length>0"
             v-for="(module,index) in config.modules">
          <div class="flex">
            <div>{{ index }}-{{ module.name }}</div>
            <div class="icons">
              <svg @click="moveModule(index,false)" :class="{disabled:index==0}" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5"
                   stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
              </svg>
              <svg @click="moveModule(index,true)" :class="{disabled:index>=config.modules.length-1}"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5"
                   stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
              </svg>
              <svg @click="disposeModule(index)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
              </svg>
            </div>
          </div>
          <div class="option" v-for="option in getOptions(module.name)">
            <div class="flex">
              {{ option.name }}

              <input v-model="module.config[option.name]" v-if="option.type=='text'" type="text"/>
              <input v-model="module.config[option.name]" v-else-if="option.type=='number'" :step="option.step"
                     :min="option.min" :max="option.max" type="number"/>

              <select v-model="module.config[option.name]" v-if="option.type=='enum'">
                <option disabled value="">Bitte wählen</option>
                <option v-for="value in option.values" :value="value">{{ value }}</option>
              </select>

              <select v-model="module.config[option.name]" v-if="option.type=='boolean'">
                <option disabled value="">Bitte wählen</option>
                <option :value="true">true</option>
                <option :value="false">false</option>
              </select>

            </div>
          </div>
        </div>
        <div v-else>Keine Module aktiviert.</div>

        <h2>Bibliothek</h2>
        <div class="flex" @mouseover="preview(module.view)" v-if="modules" v-for="(module,index) in modules">
          <div>{{ module.name }}</div>
          <div class="icons">
            <svg @click="appendModule(index)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
          </div>
        </div>
        <div v-else>Keine Module gefunden.</div>

      </aside>
      <aside v-else>
        <h2>Laden ...</h2>
        <pre>{{ modules }}</pre>
      </aside>
      <div id="preview">
        <!-- <div id="cube_overlay" :style="'hue-rotate(-930deg) brightness(4)'"></div> -->
        <canvas id="module" ref="canvas" width="128" height="160" style="background:#121513"></canvas>
      </div>
    </main>
  </div>
</template>

<style>
.module {
  background: #0005;
  padding: 6px 4px;
  margin-top: 5px;
  border: 1px outset #000;
}

.module .option {
  color: gray;
}

@font-face {
  font-family: 'vt323';
  src: url('ui/vt323.ttf');
}

.screen {
  background-color: #383838;
  background: url("ui/bg6.jpg");
  color: #fff;
  font-family: 'vt323';
  font-size: 1.5em;
  height: 100vh;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form {
  max-width: 400px;
}

.gap {
  gap: 0.4rem;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-size: 1.2em;
}

h2 {
  margin-bottom: .1em;
}

input[type="color"] {
  background: none;
  border: 2px outset #000;
  margin: 0;
  padding: 0;
}

* {
  font-family: 'vt323';
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #0006;
  height: 50px;
  background: #3677b6;
  background-image: url("ui/bg5.jpg");
  color: white;
  padding: 0 1rem;
}

.top div {
  display: flex;
  gap: 1rem;
}

main {
  display: flex;
  height: calc(100vh - 50px);
}

aside {
  padding: 0 1rem;
  flex: 1;
  background: #333e47;
  border-right: 2px solid #0005;
  background-image: url("ui/bg3.jpg");
  background-size: cover;
  color: #f3f1e7;
}

#preview {
  flex: 4;
  height: 100%;
  background-color: #000;
  background-image: url("ui/cube.jpg");
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
}

#cube_overlay {
  position: absolute;
  filter: hue-rotate(226deg) saturate(3) brightness(1.5);
  z-index: 99;
  top: 0;
  background-image: url("ui/cube_overlay.png");
  height: 100%;
  width: 100%;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
}

#preview svg {
  height: 5vh;
  width: 5vh;
  opacity: .2;
  cursor: pointer;
}

#preview svg:hover {
  opacity: 1;
}

#preview nav {
  position: absolute;
  top: 45%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 1rem;
  margin-left: -10vw;
}


#module {
  position: absolute;
  border: 2px inset #000;
  box-shadow: 0px 0px 2px #000;
  position: absolute;
  top: 36.1%;
  pointer-events: none;
  left: 0;
  right: 4px;
  margin: auto;
  height: 32%;
}

select, input {
  border: 2px inset #000;
  background: #0001;
  border-radius: 4px;
}

select, input, .eightbit-btn {
  background: #92CD41;
  display: inline-block;
  border: none;
  position: relative;
  text-align: center;
  font-size: 1.2em;
  padding: 0px 20px;
  text-decoration: none;
  box-shadow: inset -2px -2px 0px 0px #4AA52E;
  text-shadow: 0px 0px 2px 0 #000;
}

button {
  cursor: pointer;
}

.eightbit-btn:hover, .eightbit-btn:focus {
  background: #76c442;
  box-shadow: inset -4px -4px 0px 0px #4AA52E;
}


.eightbit-btn:active {
  box-shadow: inset 2px 2px 0px 0px #4AA52E;
}

.eightbit-btn:before, .eightbit-btn:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: content-box;
}

.eightbit-btn:before {
  top: -4px;
  left: 0;
  border-top: 4px black solid;
  border-bottom: 4px black solid;
}

.eightbit-btn:after {
  left: -4px;
  top: 0;
  border-left: 4px black solid;
  border-right: 4px black solid;
}

.flex {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}


.icons svg {
  cursor: pointer;
  height: 1em;
  width: 1em;
  border: 2px outset #000;
  background: #0002;
  margin: 0 1px;
}

.icons svg.disabled {
  pointer-events: none;
  border: transparent;
  color: #fff0;
}

.icons svg:hover {
  background: #0005;
}

.icons svg:active {
  border: 2px inset #000;
}

select, input {
  background: #bbb;
  outline: none;
  text-align: left;
  box-shadow: none;
  border: 4px solid #000;
  border-radius: 0;
}

.eightbit-btn--reset {
  background: #E76E55;
  box-shadow: inset -4px -4px 0px 0px #8C2022;
}

.eightbit-btn--reset:hover, .eightbit-btn--reset:focus {
  background: #CE372B;
  box-shadow: inset -6px -6px 0px 0px #8C2022;
}

.eightbit-btn--reset:active {
  box-shadow: inset 4px 4px 0px 0px #8C2022;
}

.eightbit-btn--proceed {
  background: #F7D51D;
  box-shadow: inset -2px -2px 0px 0px #E59400;
}

.eightbit-btn--proceed:hover, .eightbit-btn--proceed:focus {
  background: #F2C409;
  box-shadow: inset -4px -4px 0px 0px #E59400;
}

.eightbit-btn--proceed:active {
  box-shadow: inset 4px 4px 0px 0px #E59400;
}

*, *:before, *:after {
  box-sizing: border-box;
}

.option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.option > * {
  flex: 1;
}

.option input, .option option, .option select {
  padding: 0 2px;
  width: 100%;
  flex: 1;
  line-height: 1rem;
  font-size: 1rem;
  box-sizing: border-box;
  border-width: 1px;
}
</style>

<script lang="ts" setup>
// vars for editor
const id: String | null = ref(null)
const editMode: boolean = ref(false)
const config: Ref<any> = ref(null)
const underlineVisible: boolean = ref(false)
const speichernText: string = ref("Speichern >")

// remote info
const modules = ref([])

// have underline blink every .5 seconds
setInterval(() => {
  underlineVisible.value = !underlineVisible.value
}, 500)

const edit = () => {
  loadConfig()
  editMode.value = true
  setTimeout(() => {
    drawModule()
  }, 100)
}

const loadConfig = async () => {
  const response = await fetch(`http://localhost:3000/api/config/${id.value}`)
  config.value = await response.json()
}

const storeConfig = async () => {
  const response = await fetch(`http://localhost:3000/api/config/${id.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config.value)
  }).then(() => {
    speichernText.value = "Gespeichert."
    unsavedChanges.value = false
    setTimeout(() => {
      speichernText.value = "Speichern >"
    }, 1000)
  })
  config.value = await response.json()
}

const moveModule = (index: number, down: boolean) => {
  const temp = config.value.modules[index]
  if (down) {
    config.value.modules[index] = config.value.modules[index + 1]
    config.value.modules[index + 1] = temp
  } else {
    config.value.modules[index] = config.value.modules[index - 1]
    config.value.modules[index - 1] = temp
  }
}

const disposeModule = (index: number) => {
  config.value.modules.splice(index, 1)
}

const appendModule = (index: any) => {

  // get module
  const module = modules.value[index]

  // create new module
  const newModule = {
    name: module.name,
    version: module.version,
    config: {}
  }

  // add config
  for (const key in module.config) {
    newModule.config[module.config[key].name] = module.config[key].default
  }

  config.value.modules.push(newModule)
}

const getOptions = (name: String) => {
  // from all the modules find the one with the name and get .config
  return modules.value.find((module: any) => module.name === name)?.config
}

const predefinedColors = ['#000000', '#ffffff', "#0000ff", "#ff0000"]

const drawModule = () => {
  if (typeof window === 'undefined') return

  // get 2d context from canvas
  const ctx = document.getElementById("module")?.getContext("2d")
  if (!ctx) {
    console.error("Could not get 2d context from canvas")
    return
  }

  // draw /view.jpg onto canvas
  const img = new Image()
  img.src = view.value
  console.log("drawing image", img.src)
  img.crossOrigin = "Anonymous";
  img.onload = () => {
    ctx.drawImage(img, 0, 0)

    // replace white color pixels with red
    const imgData = ctx.getImageData(0, 0, 128, 160)

    // for each pixel
    for (let i = 0; i < imgData.data.length; i += 4) {

      let hasChanged = false

      // for each predefined color
      predefinedColors.forEach((color, index) => {

        // should convert to
        const newColor = config.value.colors[index].hex

        // if pixel matches color
        if (!hasChanged &&
            imgData.data[i] === parseInt(color.substring(1, 3), 16) &&
            imgData.data[i + 1] === parseInt(color.substring(3, 5), 16) &&
            imgData.data[i + 2] === parseInt(color.substring(5, 7), 16)) {

          // replace with the new color
          imgData.data[i] = parseInt(newColor.substring(1, 3), 16)
          imgData.data[i + 1] = parseInt(newColor.substring(3, 5), 16)
          imgData.data[i + 2] = parseInt(newColor.substring(5, 7), 16)

          hasChanged = true
        }

      })

    }
    // put image data back onto canvas
    ctx.putImageData(imgData, 0, 0)
  }

}

const preview = (url) => {
  view.value = url
  drawModule()
}

const tryPreview = (moduleName) => {
  const module = modules.value.find((module: any) => module.name === moduleName)
  if (module) {
    preview(module.view)
  }
}

const view = ref("/ui/view.png")

// dev mode
// id.value = '123'
// edit()

// if config.value.colors is an array, call drawModule
/*
setInterval(() => {
  if (config.value?.colors) {
    drawModule()
  }
}, 5000)
*/

setTimeout(() => {
  drawModule()
}, 200)

const loadModules = async () => {

  // get an overview of all modules
  // the file of known modules is located in git repo
  const url = 'https://raw.githubusercontent.com/tillmii/IcoDesk/main/WebInfo/Modules.json'

  // get the modules with fetch
  await fetch(url)
      .then(response => response.json())
      .then(data => {

        // for each repo, get the IcoMod.json
        data.forEach(async (repo: string) => {

          // get the IcoMod.json
          // origin url is https://github.com/tillmii/IcoMod_Weather/ to https://raw.githubusercontent.com/tillmii/IcoMod_Weather/main/WebInfo/IcoMod.json
          const url = repo.replace('github.com', 'raw.githubusercontent.com') + 'main/WebInfo/IcoMod.json'

          // just log the url
          console.log("getting info from repo", url)

          await fetch(url)
              .then(response => response.json())
              .then(data => {

                // log the data
                console.log("got data", data)

                //https://github.com/tillmii/IcoMod_Logo/blob/main/WebInfo/Views/View01.png
                data.view = repo.replace('github.com', 'raw.githubusercontent.com') + 'main/WebInfo/Views/View01.png'

                // add the repo to the list of known modules
                modules.value.push(data)

              })
              .catch(err => {
                console.log(err)
              })

        })
      })
      .catch(error => {
        console.error(error)
      })

}
loadModules()

const unsavedChanges = ref(false)

// watch for changes in config.value or any of its children
watch(config, () => {
  unsavedChanges.value = true
}, {deep: true})

watch(modules, () => {
  drawModule()
}, {deep: true})

</script>