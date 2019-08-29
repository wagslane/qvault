<template>
  <div>
    <HeaderBar title="Approve Changes" />
    <div class="options-box">
      <div class="body center-text">
        <h1>Changes Were Detected in Your Vault</h1>
        <h2>The vault stored in your cloud account has some differences from your local vault</h2>

        <div class="information-box">
          <div class="title">
            <span>The</span>
            <span v-html="boxDefinition.icon.img" />
            <span class="key">{{ boxDefinition.displayName }}</span>
            <span>box contains a new change </span>
          </div>

          <div
            v-for="(v, k) in secretDisplayFields"
            :key="k"
            class="field"
          >
            <span class="key">
              {{ k }}:
            </span>
            <span class="value">
              {{ v }}
            </span>
          </div>

          <hr v-if="isSubfield">

          <div
            v-for="(v, k) in secretDisplaySubfields"
            :key="k"
            class="field"
          >
            <span class="key">
              {{ k }}:
            </span>
            <span class="value">
              {{ v }}
            </span>
          </div>
        </div>

        <div class="selection-box">
          <div class="title">
            <span>Please Select the</span>
            <span class="key">{{ isSubfield ? nextConflict.subfieldKey : nextConflict.fieldKey }}</span> 
            <span>to Keep</span>
          </div>
          <div class="btns">
            <div
              class="btn"
              @click="acceptConflict"
            >
              {{ nextConflict.value }}
            </div>

            <div
              class="btn"
              @click="acceptOriginal"
            >
              {{ originalValue }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import boxTypes from '../../consts/box_types';

export default {
  computed: {
    secretDisplayFields(){
      let res = {};
      for (const k of Object.keys(this.secret.fields)) {
        const v = this.secret.fields[k];
        if (!v){
          continue;
        }
        if (Array.isArray(v)){
          continue;
        }
        if (k === this.nextConflict.fieldKey){
          continue;
        }
        res[k] = v;
      }
      return res;
    },
    secretDisplaySubfields(){
      let res = {};
      const nc = this.nextConflict;
      if(!this.isSubfield){
        return res;
      }
      for (const k of Object.keys(this.secret.fields[nc.fieldKey][nc.subfieldGroupIndex])) {
        const v = this.secret.fields[nc.fieldKey][nc.subfieldGroupIndex][k];
        if (!v){
          continue;
        }
        if (k === this.nextConflict.subfieldKey){
          continue;
        }
        res[k] = v;
      }
      return res;
    },
    boxDefinition(){
      return boxTypes.find(boxType => boxType.key === this.box.type);
    },
    box(){
      return this.$root.secrets[this.nextConflict.boxKey];
    },
    secret(){
      return this.box.secrets[this.nextConflict.secretKey];
    },
    isSubfield(){
      return this.nextConflict.hasOwnProperty('subfieldGroupIndex') && 
      this.nextConflict.hasOwnProperty('subfieldKey');
    },
    originalValue(){
      const nc = this.nextConflict;
      if (!this.isSubfield){
        return this.secret.fields[this.nextConflict.fieldKey];
      }
      return this.secret.fields[nc.fieldKey][nc.subfieldGroupIndex][nc.subfieldKey];
    },
    nextConflict(){
      return this.$store.getters.getNextConflict;
    }
  },
  watch:{
    nextConflict: async function (newNextConflict) {
      if (!newNextConflict){
        this.$router.push({name: 'Vault'});
      }
    }
  },
  methods:{
    acceptConflict(){
      const nc = this.nextConflict;
      if (!this.isSubfield){
        this.$root.secrets[nc.boxKey].secrets[nc.secretKey].fields[nc.fieldKey] = nc.value;
      } else {
        this.$root.secrets[nc.boxKey].secrets[nc.secretKey].fields[nc.fieldKey][nc.subfieldGroupIndex][nc.subfieldKey] = nc.value;
      }
      this.$store.commit("popConflict");
    },
    acceptOriginal(){
      this.$store.commit("popConflict");
    }
  }
};
</script>

<style lang="less">
  @import '../../styles/colors.less';

  .information-box{
    border: 1px solid @gray-dark;
    border-radius: 5px;
    background-color: @black-lighter;
    box-shadow: 0 2px 14px 0 @black-darker;
    margin: auto;
    width: 90%;
    margin-top: 25px;
    padding: 15px;

    .title {
      font-size: 18px;
      color: #fff;
      text-align: center;
      margin-bottom: 20px;

      .key{
        color: @gold-dark;
      }

      svg {
        vertical-align: middle;
        path {
          stroke: @gold-dark;
        }
        rect {
          stroke: @gold-dark;
        }
      }
    }

    .field{
      text-align: left;
      margin-bottom: 5px;
      margin-left: 5px;

      .key{
        color: @gray-mid;
      }

      .value{
        color: #fff;
      }
    }
  }

  .selection-box{
    border: 1px solid @gray-dark;
    border-radius: 5px;
    background-color: @black-lighter;
    box-shadow: 0 2px 14px 0 @black-darker;
    margin: auto;
    width: 90%;
    margin-top: 25px;
    padding: 15px;

    .title {
      font-size: 18px;
      color: @gray-mid;
      text-align: center;
      margin-bottom: 20px;

      .key{
        color: #fff;
      }
    }

    .btns{
      width: 100%;
      flex-grow: 2;
      display: inline-block;
    }
  }
  
</style>
