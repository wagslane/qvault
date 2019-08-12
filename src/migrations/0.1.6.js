export default function(loaded_vault, decrypted_secrets){
  for(let box of Object.values(decrypted_secrets)){
    for(let secret of Object.values(box.secrets)) {
      let fields = {};
      for (let field_key of Object.keys(secret)){
        if (field_key !== 'created') {
          fields[ field_key ] = secret[ field_key ];
          delete secret[ field_key ];
        }
        secret.fields = fields;
      }
    }
  }
  loaded_vault.version = '0.2.0';
  return [ loaded_vault, decrypted_secrets ];
}
