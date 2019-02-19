<template>
  <div>
    <HeaderBar title="Setup" />
    <div class="options-box">
      <div class= "body">
        <StepProgress :filled="2" />
        <h1>Create a Q Card backup</h1>
        <h2>Backup your vault for safekeeping</h2>

        <div v-if="$root.char_key">
          <div class='highlight-box'>
            <h3>Write the following characters on your Q Card:</h3>
            <div class='character-code'>
              <table>
                <tr>
                  <td>{{$root.char_key[0]}}</td>
                  <td>{{$root.char_key[1]}}</td>
                  <td>{{$root.char_key[2]}}</td>
                  <td>{{$root.char_key[3]}}</td>
                  <td>{{$root.char_key[4]}}</td>
                  <td>{{$root.char_key[5]}}</td>
                  <td>{{$root.char_key[6]}}</td>
                  <td>{{$root.char_key[7]}}</td>
                </tr>
                <tr>
                  <td>{{$root.char_key[8]}}</td>
                  <td>{{$root.char_key[9]}}</td>
                  <td>{{$root.char_key[10]}}</td>
                  <td>{{$root.char_key[11]}}</td>
                  <td>{{$root.char_key[12]}}</td>
                  <td>{{$root.char_key[13]}}</td>
                  <td>{{$root.char_key[14]}}</td>
                  <td>{{$root.char_key[15]}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div v-else>
          <h2>Generating backup key, please wait...</h2>
        </div>
      </div>

      <br />
      <br />
      <div class="footer">
        <div class="back" @click="$router.go(-1)">
          <div class="icon" />
        </div>
        <router-link v-if="$root.char_key" :to="{name: 'create_step_4'}">
          <button class="continue">
            <span>Continue</span>
            <div class="continue-arrow" />
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.highlight-box{
  margin: auto;
  width: 75%;
  height: 166px;
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 5px;	
  background-color: #333739;
  box-shadow: 0 2px 14px 0 rgba(0,0,0,0.1);
  padding-top: 36px;
}

.character-code{
  margin: auto;
  width: 80%;
  height: 54px;
  border-radius: 5px;	
  background-color: #1A1D1F;
  padding: 8px;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
}

table{
  width: 100%;
  height: 100%;
}

td{
  text-align: center;
}
</style>
