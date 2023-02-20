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
      <button class="eightbit-btn eightbit-btn--proceed" @click="editMode=false">&lt; Zurück</button>
      <h1>Geräte-ID: {{ id }}</h1>
      <button class="eightbit-btn" @click="storeConfig()">{{ speichernText }}</button>
    </nav>

    <main>
      <aside>
        <h2>Farben</h2>
        <div v-if="config?.colors" v-for="color in config.colors">
          <input v-model="color.hex" type="color"/>
          {{ color.name }}
        </div>
        <h2>Module</h2>
        <div class="flex" v-if="config?.modules.length>0" v-for="(module,index) in config.modules">
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

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"/>
            </svg>
            <svg @click="disposeModule(index)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>

          </div>
        </div>
        <div v-else>Keine Module aktiviert.</div>

        <h2>Bibliothek</h2>
        <div class="flex" v-if="modules" v-for="(module,index) in modules">
          <div>{{ module.name }}</div>
          <div class="icons">
            <svg @click="appendModule(index)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
          </div>
        </div>
        <div v-else>Keine Module gefunden.</div>

      </aside>
      <div id="premodule">
        <img id="module" src="ui/View01.jpg"/>
      </div>
    </main>
  </div>
</template>

<style>
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

#premodule {
  flex: 4;
  height: 100%;
  background-color: #000;
  background-image: url("ui/cube.jpg");
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
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

input {
  border: 2px inset #000;
  background: #0001;
  border-radius: 4px;
}

input, .eightbit-btn {
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

input {
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

</style>

<script lang="ts" setup>
// vars for editor
const id: String | null = ref(null)
const editMode: boolean = ref(false)
const config: Ref<any> = ref(null)
const underlineVisible: boolean = ref(false)
const speichernText: string = ref("Speichern >")

// remote info
const modules: Ref<any[]> = useModules()

// have underline blink every .5 seconds
setInterval(() => {
  underlineVisible.value = !underlineVisible.value
}, 500)

const edit = () => {
  loadConfig()
  editMode.value = true
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
  const module = modules[index]

  // create new module
  const newModule = {
    name: module.name,
    version: module.version,
    config: {}
  }

  // add config
  for (const key in module.config) {
    newModule.config[key] = module.config[key].default
  }

  config.value.modules.push(newModule)
}

// dev mode
id.value = '123'
edit()
</script>