import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send, ArrowLeft, Users, Crown, Trophy, Target, Flame, Award, Lock } from "lucide-react";
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface CommunityProps {
  onBack: () => void;
  user: User | null;
  userData: {
    days_clean: number;
    money_saved: number;
    time_saved: number;
    daily_bet_average: number;
    plan_type: 'free' | 'premium';
    points: number;
  };
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
  author_email?: string;
  liked_by_user?: boolean;
}

interface CommunityMember {
  id: string;
  email: string;
  days_clean: number;
  money_saved: number;
  plan_type: 'free' | 'premium';
  points: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  type: string;
  target_value: number | null;
  is_active: boolean;
  user_status?: 'enrolled' | 'completed' | null;
  points_awarded?: number | null;
}

export function Community({ onBack, user, userData }: CommunityProps) {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'rankings' | 'challenges'>('feed');
  const [topMembers, setTopMembers] = useState<CommunityMember[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);


  useEffect(() => {
    loadPosts();
    if (userData.plan_type === 'premium') {
      loadTopMembers();
      loadChallenges();
    }
  }, []);

  const loadPosts = async () => {
    // --- MOCKED DATA START: REMOVE THIS SECTION TO USE REAL SUPABASE DATA ---
    const mockedPosts: Post[] = [
      {
        id: 'mock-post-1',
        user_id: 'mock-user-1',
        content: 'Que bom estar aqui! Juntos somos mais fortes. 💪',
        likes: 15,
        comments: 0,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        author_email: 'joao.silva@example.com',
        liked_by_user: false,
      },
      {
        id: 'mock-post-2',
        user_id: 'mock-user-2',
        content: 'Consegui mais um dia limpo! Agradeço o apoio de todos. 🙏',
        likes: 28,
        comments: 0,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        author_email: 'maria.pereira@example.com',
        liked_by_user: true,
      },
      {
        id: 'mock-post-3',
        user_id: 'mock-user-3',
        content: 'A jornada é longa, mas cada passo conta. Não desista! ✨',
        likes: 10,
        comments: 0,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        author_email: 'carlos.almeida@example.com',
        liked_by_user: false,
      },
      {
        id: 'mock-post-4',
        user_id: 'mock-user-1',
        content: 'Alguém tem dicas para lidar com a ansiedade nos primeiros dias?',
        likes: 5,
        comments: 0,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        author_email: 'joao.silva@example.com',
        liked_by_user: false,
      },
    ];
    setPosts(mockedPosts);
    // --- MOCKED DATA END ---

    // --- ORIGINAL SUPABASE CODE (UNCOMMENT TO REVERT) ---
    // try {
    //   // First get posts
    //   const { data: postsData, error } = await supabase
    //     .from('community_posts')
    //     .select('*')
    //     .order('created_at', { ascending: false })
    //     .limit(20);

    //   if (error) throw error;

    //   if (postsData) {
    //     // Then get user profiles separately
    //     const userIds = [...new Set(postsData.map(post => post.user_id))];
    //     const { data: profilesData } = await supabase
    //       .from('user_profiles')
    //       .select('id, email')
    //       .in('id', userIds);

    //     const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

    //     const postsWithLikes = await Promise.all(
    //       postsData.map(async (post) => {
    //         // Check if current user liked this post
    //         let liked_by_user = false;
    //         if (user) {
    //           const { data: likeData } = await supabase
    //             .from('post_likes')
    //             .select('id')
    //             .eq('user_id', user.id)
    //             .eq('post_id', post.id)
    //             .single();
              
    //           liked_by_user = !!likeData;
    //         }

    //         return {
    //           ...post,
    //           author_email: profilesMap.get(post.user_id)?.email || 'Usuário',
    //           liked_by_user
    //         };
    //       })
    //     );

    //     setPosts(postsWithLikes);
    //   }
    // } catch (error) {
    //   console.error('Error loading posts:', error);
    //   // Fallback to empty array on error
    //   setPosts([]);
    // }
  };

  const loadTopMembers = async () => {
    // --- MOCKED DATA START: REMOVE THIS SECTION TO USE REAL SUPABASE DATA ---
    const mockedMembers: CommunityMember[] = [
      { id: 'mock-user-1', email: 'joao.silva@example.com', days_clean: 120, money_saved: 2500, plan_type: 'premium', points: 1500 },
      { id: 'mock-user-2', email: 'maria.pereira@example.com', days_clean: 90, money_saved: 1800, plan_type: 'premium', points: 1200 },
      { id: 'mock-user-3', email: 'carlos.almeida@example.com', days_clean: 60, money_saved: 1000, plan_type: 'free', points: 800 },
      { id: 'mock-user-4', email: 'ana.barbosa@example.com', days_clean: 45, money_saved: 750, plan_type: 'premium', points: 600 },
      { id: 'mock-user-5', email: 'pedro.costa@example.com', days_clean: 30, money_saved: 500, plan_type: 'free', points: 400 },
    ];
    setTopMembers(mockedMembers);
    // --- MOCKED DATA END ---

    // --- ORIGINAL SUPABASE CODE (UNCOMMENT TO REVERT) ---
    // try {
    //   const { data, error } = await supabase
    //     .from('user_profiles')
    //     .select('id, email, days_clean, money_saved, plan_type, points')
    //     .order('points', { ascending: false })
    //     .limit(10);

    //   if (error) throw error;
    //   if (data) setTopMembers(data);
    // } catch (error) {
    //   console.error('Error loading top members:', error);
    //   setTopMembers([]);
    // }
  };

  const loadChallenges = async () => {
    try {
      const { data: challengesData, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (challengesData && user) {
        // Get user's challenge status
        const { data: userChallenges } = await supabase
          .from('user_challenges')
          .select('challenge_id, status, points_awarded')
          .eq('user_id', user.id);

        const challengesWithStatus = challengesData.map(challenge => {
          const userChallenge = userChallenges?.find(uc => uc.challenge_id === challenge.id);
          return {
            ...challenge,
            user_status: userChallenge?.status || null,
            points_awarded: userChallenge?.points_awarded || null
          };
        });

        setActiveChallenges(challengesWithStatus);
      } else if (challengesData) {
        setActiveChallenges(challengesData.map(c => ({ ...c, user_status: null, points_awarded: null })));
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
      setActiveChallenges([]);
    }
  };
  const handleLike = async (postId: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.liked_by_user) {
        // Unlike the post
        await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);

        await supabase
          .from('community_posts')
          .update({ likes: post.likes - 1 })
          .eq('id', postId);
      } else {
        // Like the post
        await supabase!
          .from('post_likes')
          .insert({ user_id: user.id, post_id: postId });

        await supabase
          .from('community_posts')
          .update({ likes: post.likes + 1 })
          .eq('id', postId);
      }

      // Update local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              liked_by_user: !p.liked_by_user, 
              likes: p.liked_by_user ? p.likes - 1 : p.likes + 1 
            }
          : p
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim() || !user) return;

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          content: newPost.trim()
        })
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        const newPostData: Post = {
          ...data,
          author_email: user.email || 'Usuário',
          liked_by_user: false
        };

        setPosts([newPostData, ...posts]);
        setNewPost("");
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Erro ao criar post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const enrollInChallenge = async (challengeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: 'enrolled'
        });

      if (error) throw error;

      // Reload challenges to update status
      await loadChallenges();
      alert('Inscrito no desafio com sucesso!');
    } catch (error) {
      console.error('Error enrolling in challenge:', error);
      alert('Erro ao se inscrever no desafio.');
    }
  };

  const completeChallenge = async (challengeId: string) => {
    if (!user) return;

    try {
      const challenge = activeChallenges.find(c => c.id === challengeId);
      if (!challenge) return;

      // Check if user meets challenge requirements
      let canComplete = false;
      let pointsToAward = 50; // Default points

      switch (challenge.type) {
        case 'days_clean':
          canComplete = userData.days_clean >= (challenge.target_value || 7);
          pointsToAward = (challenge.target_value || 7) * 10;
          break;
        case 'money_saved':
          canComplete = userData.money_saved >= (challenge.target_value || 1000);
          pointsToAward = Math.floor((challenge.target_value || 1000) / 10);
          break;
        default:
          canComplete = true;
      }

      if (!canComplete) {
        alert('Você ainda não atende aos requisitos deste desafio.');
        return;
      }

      // Update challenge status
      const { error: challengeError } = await supabase
        .from('user_challenges')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          points_awarded: pointsToAward
        })
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId);

      if (challengeError) throw challengeError;

      // Update user points
      const { error: pointsError } = await supabase
        .from('user_profiles')
        .update({
          points: userData.points + pointsToAward
        })
        .eq('id', user.id);

      if (pointsError) throw pointsError;

      // Reload challenges and show success
      await loadChallenges();
      alert(`Desafio completado! Você ganhou ${pointsToAward} pontos!`);
    } catch (error) {
      console.error('Error completing challenge:', error);
      alert('Erro ao completar desafio.');
    }
  };
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'agora';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const getAuthorName = (email: string) => {
    return email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const canCreatePost = () => {
    if (userData.plan_type === 'premium') return true;
    const userPosts = posts.filter(p => p.user_id === user?.id);
    return userPosts.length < 1; // Free users can create 1 post
  };

  const getUserRanking = () => {
    const sortedMembers = [...topMembers].sort((a, b) => b.points - a.points);
    const userIndex = sortedMembers.findIndex(m => m.id === user?.id);
    return userIndex >= 0 ? userIndex + 1 : null;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6"
    >
      {/* Community Header */}
      <Card className="shadow-xl rounded-2xl sm:rounded-3xl border-0 bg-gradient-to-br from-white to-purple-50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Comunidade</h2>
              <p className="text-sm text-gray-500">{topMembers.length} membros ativos</p>
            </div>
            {userData.plan_type === 'premium' && (
              <Crown className="w-6 h-6 text-purple-600" />
            )}
          </div>

          {/* Tab Navigation for Premium */}
          {userData.plan_type === 'premium' && (
            <div className="flex bg-gray-100 rounded-lg sm:rounded-xl p-1 mb-4">
              {[
                { id: 'feed', label: 'Feed', icon: Users },
                { id: 'rankings', label: 'Rankings', icon: Trophy },
                { id: 'challenges', label: 'Desafios', icon: Target }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    activeTab === id
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">
                    {id === 'feed' ? 'Feed' : id === 'rankings' ? 'Rank' : 'Desaf'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <>
          {/* New Post Creation */}
          <Card className="shadow-lg rounded-2xl border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Compartilhar</h3>
              
              {userData.plan_type === 'free' && !canCreatePost() && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-700">
                      Limite de posts atingido. Upgrade para Premium para postar ilimitadamente.
                    </p>
                  </div>
                </div>
              )}

              <Textarea
                placeholder="Compartilhe sua conquista, desafio ou palavra de apoio..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                disabled={!canCreatePost() || !user}
                className="mb-3 border-0 resize-none focus:ring-1 focus:ring-purple-300"
              />
              
              <Button 
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                onClick={handleSubmitPost}
                disabled={loading || !canCreatePost() || !user || !newPost.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                {!user ? 'Faça login para postar' : 
                 !canCreatePost() ? 'Limite atingido' : 
                 loading ? 'Postando...' : 'Postar'}
              </Button>

              {userData.plan_type === 'free' && (
                <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-700 text-center">
                    <Crown className="w-3 h-3 inline mr-1" />
                    Premium: Posts ilimitados + Desafios + Rankings
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card className="shadow-lg rounded-2xl border-0">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Nenhum post ainda. Seja o primeiro a compartilhar!</p>
                </CardContent>
              </Card>
            ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {getAuthorName(post.author_email || '').charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm text-gray-800">
                            {getAuthorName(post.author_email || 'Usuário')}
                          </p>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(post.created_at)}
                          </span>
                          {post.author_email?.includes('premium') && (
                            <Crown className="w-3 h-3 text-purple-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post.id)}
                        disabled={!user}
                        className={`flex items-center gap-1 text-sm ${
                          post.liked_by_user ? 'text-red-500' : 'text-gray-500'
                        } hover:text-red-500 transition-colors disabled:opacity-50`}
                      >
                        <Heart className={`w-4 h-4 ${post.liked_by_user ? 'fill-current' : ''}`} />
                        {post.likes}
                      </motion.button>
                      
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
            )}
          </div>
        </>
      )}

      {/* Rankings Tab (Premium Only) */}
      {activeTab === 'rankings' && userData.plan_type === 'premium' && (
        <Card className="shadow-lg rounded-2xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h3 className="font-bold text-lg text-gray-800">Rankings da Comunidade</h3>
            </div>

            <div className="space-y-3">
              {topMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-4 rounded-xl ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300' :
                    index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300' :
                    index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300' :
                    'bg-white border border-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-500 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-800">
                        {getAuthorName(member.email)}
                      </p>
                      {member.plan_type === 'premium' && (
                        <Crown className="w-3 h-3 text-purple-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      {member.days_clean} dias • R$ {member.money_saved} economizados
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{member.points}</p>
                    <p className="text-xs text-gray-500">pontos</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {getUserRanking() && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-700">Sua Posição</span>
                </div>
                <p className="text-sm text-purple-600">
                  Você está em #{getUserRanking()} com {userData.points} pontos!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Challenges Tab (Premium Only) */}
      {activeTab === 'challenges' && userData.plan_type === 'premium' && (
        <div className="space-y-4">
          <Card className="shadow-lg rounded-2xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-orange-500" />
                <h3 className="font-bold text-lg text-gray-800">Desafios Ativos</h3>
              </div>

              <div className="space-y-4">
                {activeChallenges.length === 0 ? (
                  <div className="text-center py-6">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Nenhum desafio ativo no momento.</p>
                  </div>
                ) : (
                  activeChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 ${
                      challenge.user_status === 'completed'
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-white border-gray-200 hover:border-orange-300'
                    } transition-colors`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
                      {challenge.user_status === 'completed' && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Tipo: {challenge.type}</span>
                      {challenge.target_value && (
                        <span>Meta: {challenge.target_value}</span>
                      )}
                    </div>
                    
                    <div className="mt-3 p-2 bg-orange-50 rounded-lg">
                      <p className="text-xs font-medium text-orange-700">
                        🏆 Recompensa: {challenge.reward}
                      </p>
                    </div>

                    {/* Challenge Actions */}
                    <div className="mt-3">
                      {challenge.user_status === 'completed' ? (
                        <div className="p-2 bg-green-100 rounded-lg text-center">
                          <p className="text-sm font-medium text-green-700">
                            ✅ Completado! +{challenge.points_awarded} pontos
                          </p>
                        </div>
                      ) : challenge.user_status === 'enrolled' ? (
                        <Button
                          size="sm"
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          onClick={() => completeChallenge(challenge.id)}
                        >
                          Completar Desafio
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-orange-500 text-orange-700 hover:bg-orange-50"
                          onClick={() => enrollInChallenge(challenge.id)}
                        >
                          Participar
                        </Button>
                      )}
                    </div>
                  </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Challenge Stats */}
          <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Suas Estatísticas</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-white rounded-xl">
                  <Flame className="w-6 h-6 mx-auto mb-1 text-orange-500" />
                  <p className="font-bold text-lg text-gray-800">
                    {activeChallenges.filter(c => c.user_status === 'completed').length}
                  </p>
                  <p className="text-xs text-gray-500">Completados</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl">
                  <Target className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                  <p className="font-bold text-lg text-gray-800">
                    {activeChallenges.filter(c => c.user_status === 'enrolled').length}
                  </p>
                  <p className="text-xs text-gray-500">Em progresso</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl">
                  <Award className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                  <p className="font-bold text-lg text-gray-800">{userData.points}</p>
                  <p className="text-xs text-gray-500">Pontos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Free Plan Upgrade Prompt for Premium Features */}
      {userData.plan_type === 'free' && (activeTab === 'rankings' || activeTab === 'challenges') && (
        <Card className="shadow-xl rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Recursos Premium</h2>
            <p className="text-purple-700 mb-6">
              Rankings, desafios e conquistas estão disponíveis no plano Premium!
            </p>
            <div className="mb-6 p-4 bg-white rounded-xl">
              <h3 className="font-semibold text-purple-800 mb-2">Com o Premium você terá:</h3>
              <ul className="text-sm text-purple-700 space-y-1 text-left">
                <li>• 🏆 Rankings da comunidade</li>
                <li>• 🎯 Desafios semanais e mensais</li>
                <li>• 🏅 Sistema completo de conquistas</li>
                <li>• 📝 Posts ilimitados</li>
                <li>• 💬 Comentários em posts</li>
              </ul>
            </div>
            <Button 
              className="w-full mb-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              onClick={onBack}
            >
              <Crown className="w-4 h-4 mr-2" />
              Fazer Upgrade
            </Button>
          </CardContent>
        </Card>
      )}

      <Button 
        variant="outline" 
        className="w-full h-12 shadow-md"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Dashboard
      </Button>
    </motion.div>
  );
}