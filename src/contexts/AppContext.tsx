useEffect(() => {
    if (authUser) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('login');
    }
  }, [authUser]);