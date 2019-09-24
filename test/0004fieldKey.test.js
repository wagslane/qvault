import fieldKey from '../src/migrations/0004fieldKey';
import { expect } from 'chai';
import jsonStableStringify from '../src/lib/jsonStableStringify';

it('test migration 0.2.5 => 0.2.8', () => {
  let vault = {
    "version": "0.2.5"
  };
  let migrated_vault = {
    "version": "0.2.8"
  };
  let secrets = {
    "1cb7680e-3960-4214-9f27-9f6c2b81464b": {
      "name": "Custom 1",
      "type": "other",
      "secrets": {
        "312be9f8-6c15-4e9a-8a3f-4bee43be8ae1": {
          "fields": {
            "Secret": "SOME_SECRET"
          }
        },
        "5a3e5f39-1c18-49e2-89a3-6e627ecff871": {
          "fields": {
            "Notes": "SOME_NOTE"
          }
        },
      }
    },
    "b30688c1-25af-4423-b161-96c3792fb5ad": {
      "type": "password",
      "secrets": {
        "aa7cde0b-5ed9-40f4-8eea-18f14388b9b0": {
          "fields": {
            "Password": "SOME_PASSWORD"
          }
        }
      }
    },
    "6aa0282a-7cc4-4587-a185-8bf97f27b94c": {
      "type": "serverConnection",
      "secrets": {
        "aa7cde0b-5ed9-40f4-8eea-18f14388b9b0": {
          "fields": {
            "Name": "SOME_NAME"
          }
        },
        "583ddbd3-84be-4714-ae77-298d0a89df37": {
          "fields": {
            "Connection String": "SOME_CONNECTION"
          }
        },
      }
    },
    "14fb0f7c-a8f4-49e2-b4f5-577b38f3b790": {
      "type": "financialInstitution",
      "secrets": {
        "aa7cde0b-5ed9-40f4-8eea-18f14388b9b0": {
          "fields": {
            "Payment Cards": [ {
              "Expiration Date": "SOME_EXPIRATION"
            } ]
          }
        },
        "583ddbd3-84be-4714-ae77-298d0a89df37": {
          "fields": {
            "Loans": [
              {
                "Loan Number": "SOME_LOAN"
              }
            ]
          }
        },
      }
    },
  };

  let migrated_secrets = {
    "1cb7680e-3960-4214-9f27-9f6c2b81464b": {
      "name": "Custom 1",
      "type": "other",
      "secrets": {
        "312be9f8-6c15-4e9a-8a3f-4bee43be8ae1": {
          "fields": {
            "secret": "SOME_SECRET"
          }
        },
        "5a3e5f39-1c18-49e2-89a3-6e627ecff871": {
          "fields": {
            "notes": "SOME_NOTE"
          }
        },
      }
    },
    "b30688c1-25af-4423-b161-96c3792fb5ad": {
      "type": "password",
      "secrets": {
        "aa7cde0b-5ed9-40f4-8eea-18f14388b9b0": {
          "fields": {
            "password": "SOME_PASSWORD"
          }
        }
      }
    },
    "6aa0282a-7cc4-4587-a185-8bf97f27b94c": {
      "type": "serverConnection",
      "secrets": {
        "aa7cde0b-5ed9-40f4-8eea-18f14388b9b0": {
          "fields": {
            "name": "SOME_NAME"
          }
        },
        "583ddbd3-84be-4714-ae77-298d0a89df37": {
          "fields": {
            "connectionString": "SOME_CONNECTION"
          }
        },
      }
    },
    "14fb0f7c-a8f4-49e2-b4f5-577b38f3b790": {
      "type": "financialInstitution",
      "secrets": {
        "aa7cde0b-5ed9-40f4-8eea-18f14388b9b0": {
          "fields": {
            "paymentCards": [ {
              "expirationDate": "SOME_EXPIRATION"
            } ]
          }
        },
        "583ddbd3-84be-4714-ae77-298d0a89df37": {
          "fields": {
            "loans": [
              {
                "loanNumber": "SOME_LOAN"
              }
            ]
          }
        },
      }
    },
  };

  [ vault, secrets ] = fieldKey(vault, secrets);
  expect(jsonStableStringify(vault)).equal(jsonStableStringify(migrated_vault));
  expect(jsonStableStringify(secrets)).equal(jsonStableStringify(migrated_secrets));
});
