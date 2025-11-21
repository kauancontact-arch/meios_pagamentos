const fetchUserData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating...');
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser.user) {
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: id,
                first_name: authUser.user.user_metadata?.first_name || '',
                last_name: authUser.user.user_metadata?.last_name || '',
                avatar_url: authUser.user.user_metadata?.avatar_url || '',
              })
              .select()
              .single();

            if (insertError) throw insertError;
            setUserData(newProfile);
          }
        } else {
          throw error;
        }
      } else {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching/creating user data:', error);
    } finally {
      setLoading(false);
    }
  };