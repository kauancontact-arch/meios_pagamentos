if (isSignUp) {
                const result = await signUp(email, password, { firstName, lastName });
                if (result.user) {
                  setSuccess('Conta criada e logada com sucesso!');
                  // The auth state change will handle navigation automatically
                } else {
                  setSuccess('Conta criada com sucesso! Verifique seu email para confirmar.');
                }
              } else {
                await login(email, password);
              }