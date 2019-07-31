import m_0_1_6 from './0.1.6';

function get_null_migration(to_version){
  return function(loaded_vault, decrypted_secrets){
    loaded_vault.version = to_version;
    return [ loaded_vault, decrypted_secrets ];
  };
}

export default {
  '0.1.5': get_null_migration('0.1.6'),
  '0.1.6': m_0_1_6,
};
