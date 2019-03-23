<template>
  <form
    class="wrapper"
  >
    <input
      v-model="secret['Institution Name']"
      placeholder="Institution Name"
      class="box_name"
    >
    <hr />
    <input
      v-model="secret['Routing Number']"
      placeholder="Routing Number"
      class="secret_value"
    >
    <label>Payment Cards</label>
    <div
      v-for="card in secret['Payment Cards']"
    >
      <input
        type="text"
        v-model="card['card_number']"
        placeholder="Card Number"
      />
      <input
        type="text"
        v-model="card['cvc']"
        placeholder="CVC"
      />
      <input
        type="text"
        v-model="card['expiration']"
        placeholder="Expiration Date"
      />
      <input
        type="text"
        v-model="card['notes']"
        placeholder="notes"
      />
    </div>
    <label>Loans</label>
    <div
      v-for="loan in secret['Loans']"
    >
      <input
        type="text"
        v-model="loan['name']"
        placeholder="Name"
      />
      <input
        type="text"
        v-model="loan['number']"
        placeholder="Loan Number"
      />
      <input
        type="text"
        v-model="loan['due']"
        placeholder="Due Date"
      />
      <input
        type="text"
        v-model="loan['notes']"
        placeholder="notes"
      />
    </div>
    <label>Account Numbers</label>
    <button></button>
    <div
      v-for="account in secret['Account Numbers']"
    >
      <input
        type="text"
        v-model="account['name']"
        placeholder="Name"
      />
      <input
        type="text"
        v-model="account['number']"
        placeholder="Account Number"
      />
      <input
        type="text"
        v-model="account['notes']"
        placeholder="notes"
      />
    </div>
    <textarea
      placeholder="Notes"
      v-model="secret['Notes']"
      class="note"
    ></textarea>
  </form>
</template>

<script>
  import Vue from 'vue';

  export default {
    props: {
      'secret': {
        type: Object,
        required: true,
      },
      'fields': {
        type: Array,
        required: true,
      },
    },
    data(){
      if(!this.secret['Payment Cards']){
        Vue.set(this.secret, 'Payment Cards', [])
      }
      if(!this.secret['Loans']){
        Vue.set(this.secret, 'Loans', [])
      }
      if(!this.secret['Account Numbers']){
        Vue.set(this.secret, 'Account Numbers', [])
      }
      return {};
    },
    methods: {
      add_card(){
        this.secret['Payment Cards'].push({
          card_number: null,
          cvc: null,
          expiration: null,
          notes: null,
        })
      },
      add_loan(){
        this.secret['Loans'].push({
          name: null,
          number: null,
          due: null,
          notes: null,
        })
      },
      add_account(){
        this.secret['Account Numbers'].push({
          name: null,
          number: null,
          notes: null,
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../../styles/secrets.less';

  .note {
    padding: 10px;
    border: 1px solid #7E8A95;
    border-radius: 6px;
    background: transparent;
    color: #8C8E8F;
    width: 100%;
  }
</style>
