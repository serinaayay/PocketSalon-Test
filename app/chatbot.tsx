import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions, Image } from "react-native";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Capability {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

const capabilities: Capability[] = [
  { icon: 'water-outline', text: 'Care routines & washing tips' },
  { icon: 'medical-outline', text: 'Hair health diagnosis' },
  { icon: 'leaf-outline', text: 'Natural remedies' },
  { icon: 'sunny-outline', text: 'Lifestyle & environmental effects' },
  { icon: 'warning-outline', text: 'Myths & common mistakes' },
  { icon: 'lock-closed-outline', text: 'Privacy & app features' },
  { icon: 'pulse-outline', text: 'Hair types & damage info' },
];

const exampleQuestions = [
  'How often should I wash curly hair?',
  'Does trimming help hair grow faster?',
  'How to prevent sun damage?',
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const conversationContext = useRef<{
    lastHairType?: string;
    lastTopic?: string;
    mentionedIssues?: string[];
  }>({});

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const getAIResponse = (userQuestion: string): string => {
    const lowerQuestion = userQuestion.toLowerCase().trim();

    if (lowerQuestion.length < 3) {
      return "I can't understand your question or your question is not related to the app.";
    }

    // Update conversation context
    const updateContext = (topic?: string, hairType?: string, issue?: string) => {
      if (topic) conversationContext.current.lastTopic = topic;
      if (hairType) conversationContext.current.lastHairType = hairType;
      if (issue) {
        if (!conversationContext.current.mentionedIssues) {
          conversationContext.current.mentionedIssues = [];
        }
        if (!conversationContext.current.mentionedIssues.includes(issue)) {
          conversationContext.current.mentionedIssues.push(issue);
        }
      }
    };

    if (lowerQuestion === 'hello' || lowerQuestion === 'hi' || lowerQuestion === 'hey' || lowerQuestion.startsWith('hello ') || lowerQuestion.startsWith('hi ') || lowerQuestion.startsWith('hey ')) {
      return "Hello! I'm here to help you with hair care tips, hair types, and hair health questions. What would you like to know?";
    }

    if (lowerQuestion.includes('thank you') || lowerQuestion.includes('thanks') || lowerQuestion === 'ty') {
      return "You're welcome! Happy to help with your hair care journey! Feel free to ask more questions anytime.";
    }

    if (lowerQuestion === 'bye' || lowerQuestion === 'goodbye' || lowerQuestion.includes('see you') || lowerQuestion.includes('talk later')) {
      return "Goodbye! Take care of your hair! Come back anytime you have questions.";
    }

    if ((lowerQuestion.includes('natural') || lowerQuestion.includes('organic') || lowerQuestion.includes('remedies') || lowerQuestion.includes('remedy')) && (lowerQuestion.includes('better') || lowerQuestion.includes('work') || lowerQuestion.includes('vs') || lowerQuestion.includes('versus') || lowerQuestion.includes('market') || lowerQuestion.includes('product'))) {
      return "Natural remedies vs. commercial products:\n\nNot necessarily better, just different!\n\nNatural remedies:\n• Fewer chemicals\n• Budget-friendly\n• May take longer to see results\n• Can be messy\n\nCommercial products:\n• Scientifically formulated\n• Convenient\n• Can contain harsh ingredients\n• More expensive\n\nIt really depends on YOUR preference! Both can work well when chosen correctly for your hair type.";
    }

    const outOfScopeKeywords = ['brand', 'shampoo', 'conditioner', 'buy', 'recommend', 'best brand', 'which product', 'style', 'cut', 'bob', 'mohawk', 'braid', 'ponytail', 'updo', 'hairstyle', 'color', 'dye', 'bleach', 'highlight', 'tint', 'bald', 'alopecia', 'scalp', 'dandruff', 'itchy', 'doctor', 'medical', 'weather', 'news', 'math', 'calculate', 'recipe', 'joke'];

    for (const keyword of outOfScopeKeywords) {
      if (lowerQuestion.includes(keyword)) {
        return "I can't understand your question or your question is not related to the app.";
      }
    }
    // Specific question: Does trimming help hair grow faster?
    if (lowerQuestion.includes('trim') && (lowerQuestion.includes('grow') || lowerQuestion.includes('faster') || lowerQuestion.includes('longer') || lowerQuestion.includes('help'))) {
      updateContext('trimming');
      return "MYTH BUSTED: Trimming does NOT make hair grow faster.\n\nWhy this is a myth:\n• Hair grows from the ROOTS (scalp), not the ends\n• Cutting ends doesn't affect growth rate\n• Growth happens at ~0.5 inches per month regardless\n\nBUT trimming IS important because:\n• Prevents split ends from traveling UP the hair shaft\n• Makes hair APPEAR longer and healthier\n• Helps you RETAIN length (less breakage)\n• Removes damaged, weak ends\n\nBest practice:\n• Trim every 6-8 weeks (or every 3-4 months minimum)\n• Remove only 1/4 to 1/2 inch\n• Use sharp scissors (dull ones cause more damage)\n• Trim when hair is dry for accuracy\n\nThink of it as maintenance, not growth stimulation!";
    }

    if (lowerQuestion.includes('brush') && (lowerQuestion.includes('grow') || lowerQuestion.includes('longer') || lowerQuestion.includes('times') || lowerQuestion.includes('day'))) {
      return "MYTH: Brushing 100 times a day does NOT make hair grow longer.\n\nExcessive brushing can actually cause:\n• Breakage\n• Split ends\n• Hair loss\n\nBrush gently only when needed to detangle. Use a wide-tooth comb on wet hair to minimize damage.";
    }

    if ((lowerQuestion.includes('oily') || lowerQuestion.includes('greasy')) && lowerQuestion.includes('wash') && (lowerQuestion.includes('multiple') || lowerQuestion.includes('many') || lowerQuestion.includes('often') || lowerQuestion.includes('every day'))) {
      return "MYTH: Washing oily hair multiple times a day can make it WORSE!\n\nOver-washing strips natural oils, causing your scalp to produce even more oil to compensate.\n\nBetter approach:\n• Wash 2-3 times per week\n• Use dry shampoo between washes\n• Focus shampoo on scalp, conditioner on ends\n• Let your scalp regulate naturally";
    }

    if ((lowerQuestion.includes('cold water') || lowerQuestion.includes('cold rinse')) && (lowerQuestion.includes('shine') || lowerQuestion.includes('shiny'))) {
      return "FACT: Cold water CAN make hair shinier!\n\nCold water helps seal the hair cuticle, making it lie flat and reflect more light. However, the effect is temporary.\n\nBest practice: Rinse with cool (not ice cold) water as a final step after conditioning.";
    }

    if (lowerQuestion.includes('wet hair') && lowerQuestion.includes('brush')) {
      return "CAREFUL: Brushing wet hair can cause breakage!\n\nWet hair is more fragile and elastic. If you must detangle:\n• Use a wide-tooth comb\n• Start from the ends and work up\n• Apply leave-in conditioner first\n• Be very gentle\n\nOr better yet, detangle before washing.";
    }

    if ((lowerQuestion.includes('air dry') || lowerQuestion.includes('air-dry')) && (lowerQuestion.includes('blow dry') || lowerQuestion.includes('better'))) {
      return "IT DEPENDS!\n\nAir drying:\n• No heat damage\n• Takes longer\n• Can cause frizz if done incorrectly\n\nBlow drying:\n• Faster, more control\n• Heat damage if done wrong\n\nBest of both: Air dry 70%, then blow dry on low heat with heat protectant.";
    }

    if (lowerQuestion.includes('follow') && (lowerQuestion.includes('suggested') || lowerQuestion.includes('routine') || lowerQuestion.includes('system'))) {
      return "No, you don't HAVE to follow our suggested routines!\n\nOur recommendations are based on general hair type and damage analysis. They're a helpful starting point, but:\n\n• Your hair is unique\n• Adjust based on what works for YOU\n• Listen to your hair's needs\n• Experiment and find your perfect routine\n\nUse our suggestions as a guide, not a strict rule!";
    }

    if (lowerQuestion.includes('privacy') || (lowerQuestion.includes('data') && (lowerQuestion.includes('safe') || lowerQuestion.includes('used') || lowerQuestion.includes('share'))) || lowerQuestion.includes('photo')) {
      return "Your privacy is protected!\n\n• Photos are analyzed LOCALLY on your device\n• We don't upload or store your images\n• Your hair data stays on YOUR phone\n• No sharing with third parties\n• All analysis happens offline\n\nYour hair journey is completely private!";
    }

    if (lowerQuestion.includes('aloe') || lowerQuestion.includes('coconut') || lowerQuestion.includes('avocado') || lowerQuestion.includes('egg') || lowerQuestion.includes('honey') || lowerQuestion.includes('olive') || lowerQuestion.includes('rosemary')) {
      return "Natural remedies can be beneficial!\n\nCommon natural treatments:\n• Coconut oil: Deep moisture\n• Aloe vera: Soothing, strengthening\n• Avocado: Rich in vitamins\n• Egg mask: Protein boost\n• Honey: Moisture retention\n\nAlways do a patch test first! Natural doesn't always mean safe for everyone. Check our Natural Remedies section in the app for detailed recipes!";
    }

    // Specific question: How often should I wash curly hair?
    if ((lowerQuestion.includes('how often') || lowerQuestion.includes('how many times') || lowerQuestion.includes('frequency')) && 
        (lowerQuestion.includes('wash') || lowerQuestion.includes('shampoo')) && 
        (lowerQuestion.includes('curly') || lowerQuestion.includes('type 3') || conversationContext.current.lastHairType === 'curly')) {
      updateContext('washing', 'curly');
      return "For CURLY hair (Type 3), wash 1-2 times per week.\n\nWhy less frequent?\n• Curly hair is naturally drier\n• Natural oils take longer to travel down curls\n• Over-washing strips essential moisture\n• Can cause frizz and breakage\n\nBest practices:\n• Use sulfate-free shampoo\n• Focus shampoo on scalp only\n• Condition mid-lengths to ends\n• Co-wash (conditioner-only) between shampoos\n• Deep condition weekly\n\nAdjust if:\n• You exercise frequently (may need 2-3x)\n• You have oily scalp (focus on scalp only)\n• You use heavy products (clarify monthly)";
    }

    // General washing frequency question
    if ((lowerQuestion.includes('how often') || lowerQuestion.includes('how many') || lowerQuestion.includes('wash')) && !lowerQuestion.includes('oily')) {
      const hairType = lowerQuestion.includes('straight') ? 'straight' : 
                      lowerQuestion.includes('wavy') ? 'wavy' : 
                      lowerQuestion.includes('curly') ? 'curly' : 
                      lowerQuestion.includes('kinky') || lowerQuestion.includes('coily') ? 'kinky' : 
                      conversationContext.current.lastHairType;
      
      if (hairType) updateContext('washing', hairType);
      
      return "Washing frequency by hair type:\n\n• Type 1 (Straight): Every 2-3 days (gets oily faster)\n• Type 2 (Wavy): 2-3 times per week\n• Type 3 (Curly): 1-2 times per week\n• Type 4 (Kinky/Coily): Once a week or less\n\nAdjust based on:\n• Lifestyle (exercise, environment)\n• Scalp oiliness\n• Hair thickness\n• Product buildup";
    }

    if (lowerQuestion.includes('routine') || lowerQuestion.includes('steps') || lowerQuestion.includes('daily') || lowerQuestion.includes('weekly')) {
      return "Basic hair care routine:\n\nWEEKLY:\n1. Cleanse scalp thoroughly\n2. Condition mid-lengths to ends\n3. Deep condition (once/week)\n4. Trim every 6-8 weeks\n\nDAILY:\n• Gentle detangling\n• Protect from sun/heat\n• Sleep on silk/satin\n• Drink water, eat healthy\n\nCustomize based on YOUR hair type and needs!";
    }

    if ((lowerQuestion.includes('refresh') || lowerQuestion.includes('revive')) && (lowerQuestion.includes('curl') || lowerQuestion.includes('wave'))) {
      return "Refresh curls/waves without washing:\n\n1. Lightly dampen with water spray\n2. Apply leave-in conditioner or curl cream\n3. Scrunch gently\n4. Air dry or diffuse on low\n5. Use silk/satin pillowcase at night\n\nPro tip: Sleep in a pineapple (high loose ponytop) or use a bonnet to preserve curls overnight!";
    }

    if ((lowerQuestion.includes('summer') || lowerQuestion.includes('winter')) && lowerQuestion.includes('care')) {
      return "Seasonal hair care:\n\nSUMMER:\n• UV protection (hats, UV sprays)\n• Deep conditioning weekly\n• Rinse after swimming\n• Avoid excessive heat styling\n\nWINTER:\n• Extra moisture (oils, masks)\n• Protect from cold wind\n• Humidifier indoors\n• Avoid hot water washes\n\nAdjust your routine with the seasons!";
    }

    if ((lowerQuestion.includes('how') && (lowerQuestion.includes('know') || lowerQuestion.includes('tell') || lowerQuestion.includes('check'))) && (lowerQuestion.includes('healthy') || lowerQuestion.includes('damage') || lowerQuestion.includes('unhealthy'))) {
      return "Signs of HEALTHY hair:\n• Shiny and smooth\n• Minimal breakage\n• Elastic (stretches slightly without breaking)\n• No split ends\n• Soft texture\n\nSigns of DAMAGED hair:\n• Dull, lifeless\n• Excessive shedding\n• Breaks easily\n• Split/frayed ends\n• Rough, tangled\n\nUse our app's damage detector to analyze your hair!";
    }

    if (lowerQuestion.includes('test') && (lowerQuestion.includes('hair') || lowerQuestion.includes('damage') || lowerQuestion.includes('health'))) {
      return "Simple hair health tests:\n\n1. ELASTICITY TEST:\nStretch a strand when wet. Healthy hair stretches 50% then returns.\n\n2. POROSITY TEST:\nDrop hair in water. Floats = low, sinks slowly = normal, sinks fast = high.\n\n3. BREAKAGE TEST:\nGently pull a strand. Breaks easily = damaged.\n\nFor accurate analysis, use our app's AI detection feature!";
    }

    // Specific question: How to prevent sun damage?
    if (lowerQuestion.includes('sun') && (lowerQuestion.includes('prevent') || lowerQuestion.includes('protect') || lowerQuestion.includes('avoid') || lowerQuestion.includes('how'))) {
      updateContext('sun protection');
      return "How to PREVENT sun damage to your hair:\n\n1. PHYSICAL PROTECTION:\n• Wear wide-brimmed hats or scarves\n• Use umbrellas in direct sunlight\n• Cover hair when swimming\n\n2. PRODUCT PROTECTION:\n• Use UV-protectant hair sprays/serums\n• Apply leave-in conditioner with UV filters\n• Use hair oils with natural SPF (coconut, jojoba)\n• Look for products with UV filters (octinoxate, avobenzone)\n\n3. TIMING:\n• Avoid peak sun hours (10am-4pm)\n• Seek shade when possible\n• Plan outdoor activities for early morning/evening\n\n4. AFTER-SUN CARE:\n• Rinse hair after sun exposure\n• Deep condition weekly\n• Use protein treatments if hair feels weak\n• Avoid heat styling on sun-exposed days\n\n5. FOR COLORED HAIR:\n• Extra protection needed (color fades faster)\n• Use color-safe UV products\n• Consider color-depositing conditioners\n\nRemember: Prevention is easier than repair!";
    }

    // General sun damage question
    if (lowerQuestion.includes('sun') && (lowerQuestion.includes('damage') || lowerQuestion.includes('affect') || lowerQuestion.includes('harm'))) {
      updateContext('sun damage');
      return "YES, sun DOES damage hair!\n\nUV rays cause:\n• Color fading\n• Protein loss\n• Dryness and brittleness\n• Weakened strands\n• Split ends\n• Loss of elasticity\n\nProtection:\n• Wear hats or scarves\n• UV-protectant hair products\n• Avoid peak sun (10am-4pm)\n• Deep condition weekly\n• Rinse after sun exposure";
    }

    if (lowerQuestion.includes('pollution') || lowerQuestion.includes('pollutants')) {
      return "Pollution damages hair:\n\nEffects:\n• Buildup on scalp and strands\n• Dullness\n• Scalp irritation\n• Accelerated aging\n\nProtection:\n• Wash hair regularly\n• Use clarifying shampoo weekly\n• Protective hairstyles\n• Antioxidant hair products\n• Cover hair in heavily polluted areas";
    }

    if ((lowerQuestion.includes('swim') || lowerQuestion.includes('pool') || lowerQuestion.includes('chlorine') || lowerQuestion.includes('ocean') || lowerQuestion.includes('sea'))) {
      return "Swimming & hair care:\n\nCHLORINE/SALT WATER can:\n• Dry out hair\n• Cause color fading\n• Create tangles\n• Strip natural oils\n\nProtection:\n1. Wet hair with clean water first\n2. Apply leave-in conditioner\n3. Wear a swim cap if possible\n4. Rinse IMMEDIATELY after\n5. Deep condition after swimming";
    }

    if (lowerQuestion.includes('diet') && (lowerQuestion.includes('hair') || lowerQuestion.includes('affect') || lowerQuestion.includes('health'))) {
      return "YES! Diet greatly affects hair health.\n\nEssential nutrients:\n• Protein: Hair building blocks\n• Iron: Prevents shedding\n• Omega-3: Scalp health\n• Biotin: Strengthens hair\n• Vitamins A, C, E: Growth & shine\n\nEat:\nEggs, fish, nuts, leafy greens, berries, sweet potatoes\n\nDrink plenty of water!";
    }

    if ((lowerQuestion.includes('gym') || lowerQuestion.includes('workout') || lowerQuestion.includes('exercise') || lowerQuestion.includes('sweat')) && lowerQuestion.includes('hair')) {
      return "Post-workout hair care:\n\nSweat contains salt that can:\n• Dry out hair\n• Cause buildup\n• Lead to breakage\n\nAfter gym:\n1. Rinse with water (no need to shampoo every time)\n2. Use dry shampoo on roots\n3. Tie hair loosely while working out\n4. Wash 2-3x per week\n5. Keep hair moisturized\n\nDon't let sweat sit for hours!";
    }

    if (lowerQuestion.includes('straight') || lowerQuestion.includes('type 1') || lowerQuestion.includes('1a') || lowerQuestion.includes('1b') || lowerQuestion.includes('1c')) {
      updateContext('hair type', 'straight');
      return "Straight hair (Type 1):\n\nNo curl pattern, lies flat.\n\n• 1A: Fine, soft, very straight\n• 1B: Medium texture, slight body\n• 1C: Coarse, may have slight bends\n\nCare tips:\n• Wash every 2-3 days\n• Lightweight products\n• Avoid heavy oils\n• Regular trims to prevent oiliness from traveling down";
    }

    if (lowerQuestion.includes('wavy') || lowerQuestion.includes('type 2') || lowerQuestion.includes('2a') || lowerQuestion.includes('2b') || lowerQuestion.includes('2c')) {
      updateContext('hair type', 'wavy');
      return "Wavy hair (Type 2):\n\nS-shaped pattern.\n\n• 2A: Fine, thin waves\n• 2B: Medium waves, more defined\n• 2C: Thick, coarse, prone to frizz\n\nCare tips:\n• Wash 2-3x per week\n• Lightweight moisture\n• Scrunch while wet\n• Air dry or diffuse on low";
    }

    if (lowerQuestion.includes('curly') || lowerQuestion.includes('type 3') || lowerQuestion.includes('3a') || lowerQuestion.includes('3b') || lowerQuestion.includes('3c')) {
      updateContext('hair type', 'curly');
      return "Curly hair (Type 3):\n\nWell-defined spiral curls.\n\n• 3A: Loose, big curls\n• 3B: Springy ringlets\n• 3C: Tight corkscrew curls\n\nCare tips:\n• Wash 1-2x per week\n• Deep condition weekly\n• Never brush dry\n• Use curl creams\n• Silk/satin pillowcase";
    }

    if (lowerQuestion.includes('kinky') || lowerQuestion.includes('coily') || lowerQuestion.includes('type 4') || lowerQuestion.includes('4a') || lowerQuestion.includes('4b') || lowerQuestion.includes('4c')) {
      updateContext('hair type', 'kinky');
      return "Kinky/Coily hair (Type 4):\n\nTight coils, zigzag patterns.\n\n• 4A: Soft, tight coils\n• 4B: Z-pattern, sharp angles\n• 4C: Very tight, fragile, high shrinkage\n\nCare tips:\n• Wash once a week or less\n• Maximum moisture\n• Protective styles\n• Gentle detangling\n• Rich oils and butters";
    }

    if (lowerQuestion.includes('damage') || lowerQuestion.includes('breakage') || lowerQuestion.includes('heat') || lowerQuestion.includes('chemical')) {
      updateContext('damage', undefined, 'damage');
      return "Hair damage:\n\nCommon causes:\n• Heat styling without protection\n• Chemical treatments\n• Rough handling\n• Environmental factors\n• Lack of moisture\n\nRecovery:\n• Deep conditioning weekly\n• Trim damaged ends\n• Gentle handling\n• Minimize heat/chemicals\n• Use our app to track progress!";
    }

    if (lowerQuestion.includes('hair type') || lowerQuestion.includes('what type')) {
      return "There are 4 main hair types:\n\n• Type 1: Straight\n• Type 2: Wavy\n• Type 3: Curly\n• Type 4: Kinky/Coily\n\nEach has sub-categories (A, B, C).\n\nUse our app's detection feature to identify YOUR hair type!";
    }

    // Use context to provide more relevant fallback
    const contextHint = conversationContext.current.lastHairType 
      ? `\n\nSince you mentioned ${conversationContext.current.lastHairType} hair, you might want to ask about ${conversationContext.current.lastHairType} hair care routines!`
      : '';
    
    const issueHint = conversationContext.current.mentionedIssues && conversationContext.current.mentionedIssues.length > 0
      ? `\n\nYou've asked about: ${conversationContext.current.mentionedIssues.join(', ')}. Feel free to ask follow-up questions!`
      : '';

    return "I can help you with hair types, damage, care routines, natural remedies, and hair health tips! Could you rephrase your question?" + contextHint + issueHint + "\n\nTry asking:\n• 'How often should I wash curly hair?'\n• 'Does trimming help hair grow faster?'\n• 'How to prevent sun damage?'\n• 'Are natural remedies better?'";
  };

  const handleExampleQuestion = (question: string) => {
    setShowWelcome(false);
    // Clear input immediately
    setInputText("");
    // Send the question (this will add to existing messages, not replace them)
    sendMessage(question);
  };

  const sendMessage = (questionText?: string) => {
    const textToSend = questionText || inputText.trim();
    if (!textToSend) return;

    setShowWelcome(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Get AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(textToSend),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 500);

    if (!questionText) {
      setInputText("");
    }
  };

  return (
    <View className="flex-1 bg-[#FFF2E4]">
      {/* Fixed Header */}
      <View className="w-full bg-[#3F2305] rounded-b-3xl pt-12 pb-6">
        <View className="flex-row items-center justify-center relative">
          <Pressable 
            onPress={() => router.push('/homepage')} 
            className="absolute left-6"
            style={{ top: '50%', transform: [{ translateY: -10 }] }}>
            <Image
              source={require('../assets/images/arrow.png')}
              style={{ width: 24, height: 24, tintColor: '#FAF7F0' }}
              resizeMode="contain"/>
          </Pressable>
          
          <View className="items-center justify-center px-16">
            <Text className="text-[#FAF7F0] text-3xl font-bold text-center">
              PocketSalon Assistant
            </Text>
            <Text className="text-[#FAF7F0] text-base text-center mt-2">
              Ask about hair types, care routines & health tips
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}>
        {showWelcome && messages.length === 0 ? (
          <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
            {/* What I can help you with */}
            <Text className="text-[#3F2305] text-xl font-bold mb-4">What I can help you with:</Text>
            <View className="mb-6">
              {capabilities.map((capability, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <Ionicons name={capability.icon} size={20} color="#3F2305" style={{ marginRight: 12 }} />
                  <Text className="text-[#3F2305] text-base flex-1">{capability.text}</Text>
                </View>
              ))}
            </View>

            {/* Try asking */}
            <Text className="text-[#3F2305] text-xl font-bold mb-4 mt-2">Try asking:</Text>
            <View className="mb-6">
              {exampleQuestions.map((question, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleExampleQuestion(question)}
                  className="bg-gray-200 rounded-lg px-4 py-3 mb-3">
                  <Text className="text-[#3F2305] text-base">{question}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-4"
            contentContainerStyle={{ paddingBottom: 20 }}>
            {messages.map((message) => (
              <View
                key={message.id}
                className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}>
                <View
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.isUser ? 'bg-[#3F2305]' : 'bg-[#F2EAD3]'
                  }`}>
                  <Text className={`text-base ${message.isUser ? 'text-white' : 'text-[#3F2305]'}`}>
                    {message.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Input */}
        <View className="bg-white border-t border-[#DFD7BF] px-4 py-3 flex-row items-center">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about hair care..."
            placeholderTextColor="#3F2305"
            className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-4 mr-2 text-base"
            multiline
            maxLength={200}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <Pressable 
            onPress={() => sendMessage()} 
            className="bg-[#3F2305] rounded-full items-center justify-center"   
            style={{width: 50, height: 50 }}>
            <Image
              source={require('../assets/images/arrow.png')}
              style={{ width: '50%', height: '50%', resizeMode: 'contain', transform: [{ rotate: '180deg' }]}}
              resizeMode="contain"/>
          </Pressable>
        </View>

        {/* Bottom Bar - Feedback Icons (shown when in chat mode) */}
        {!showWelcome && messages.length > 0 && (
          <View className="bg-white border-t border-[#DFD7BF] px-4 py-2 flex-row justify-center items-center opacity-50">
            <Pressable className="mx-4">
              <Ionicons name="thumbs-up-outline" size={24} color="#3F2305" />
            </Pressable>
            <Pressable className="mx-4">
              <Ionicons name="thumbs-down-outline" size={24} color="#3F2305" />
            </Pressable>
            <Pressable className="mx-4">
              <Ionicons name="download-outline" size={24} color="#3F2305" />
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
