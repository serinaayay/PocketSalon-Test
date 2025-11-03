import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions, Image} from "react-native";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "Hello! I'm PocketSalon Assistant. I can help you with:\n\n• Hair care routines & washing tips\n• Hair health diagnosis\n• Natural remedies\n• Lifestyle & environmental effects\n• Hair myths & common mistakes\n• App features & privacy\n• Hair types & damage info\n\nTry these sample questions:\n• How often should I wash curly hair?\n• Is it true that trimming makes hair grow faster?\n• How to protect hair from sun damage?\n• Are natural remedies better than products?\n• Is my data being used somewhere?\n• How can I tell if my hair is damaged?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const getAIResponse = (userQuestion: string): string => {
    const lowerQuestion = userQuestion.toLowerCase().trim();

    if (lowerQuestion.length < 3) {
      return "I can't understand your question or your question is not related to the app.";
    }

    if (lowerQuestion === 'hello' || lowerQuestion === 'hi' || lowerQuestion === 'hey' || lowerQuestion.startsWith('hello ') || lowerQuestion.startsWith('hi ') || lowerQuestion.startsWith('hey ')) {
      return "Hello! I'm here to help you with hair care tips, hair types, and hair health questions. What would you like to know?";
    }

    if (lowerQuestion.includes('thank you') || lowerQuestion.includes('thanks') || lowerQuestion === 'ty') {
      return "You're welcome! Happy to help with your hair care journey!  Feel free to ask more questions anytime.";
    }

    if (lowerQuestion === 'bye' || lowerQuestion === 'goodbye' || lowerQuestion.includes('see you') || lowerQuestion.includes('talk later')) {
      return "Goodbye! Take care of your hair!  Come back anytime you have questions.";
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
    if (lowerQuestion.includes('trim') && (lowerQuestion.includes('grow') || lowerQuestion.includes('faster') || lowerQuestion.includes('longer'))) {
      return "MYTH: Trimming doesn't make hair grow faster.\n\nYour hair grows from the roots, not the ends! However, regular trims (every 6-8 weeks) prevent split ends from traveling up the hair shaft, making your hair appear healthier and helping you retain length.";
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

    if ((lowerQuestion.includes('how often') || lowerQuestion.includes('how many') || lowerQuestion.includes('wash')) && !lowerQuestion.includes('oily')) {
      return "Washing frequency by hair type:\n\n• Type 1 (Straight): Every 2-3 days (gets oily faster)\n• Type 2 (Wavy): 2-3 times per week\n• Type 3 (Curly): 1-2 times per week\n• Type 4 (Kinky/Coily): Once a week or less\n\nAdjust based on:\n• Lifestyle (exercise, environment)\n• Scalp oiliness\n• Hair thickness\n• Product buildup";
    }

    if (lowerQuestion.includes('routine') || lowerQuestion.includes('steps') || lowerQuestion.includes('daily') || lowerQuestion.includes('weekly')) {
      return "Basic hair care routine:\n\n WEEKLY:\n1. Cleanse scalp thoroughly\n2. Condition mid-lengths to ends\n3. Deep condition (once/week)\n4. Trim every 6-8 weeks\n\nDAILY:\n• Gentle detangling\n• Protect from sun/heat\n• Sleep on silk/satin\n• Drink water, eat healthy\n\nCustomize based on YOUR hair type and needs!";
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

    if (lowerQuestion.includes('sun') && (lowerQuestion.includes('damage') || lowerQuestion.includes('affect') || lowerQuestion.includes('harm'))) {
      return "YES, sun DOES damage hair!\n\nUV rays cause:\n• Color fading\n• Protein loss\n• Dryness and brittleness\n• Weakened strands\n\nProtection:\n• Wear hats or scarves\n• UV-protectant hair products\n• Avoid peak sun (10am-4pm)\n• Deep condition weekly";
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
      return "Straight hair (Type 1):\n\nNo curl pattern, lies flat.\n\n• 1A: Fine, soft, very straight\n• 1B: Medium texture, slight body\n• 1C: Coarse, may have slight bends\n\nCare tips:\n• Wash every 2-3 days\n• Lightweight products\n• Avoid heavy oils\n• Regular trims to prevent oiliness from traveling down";
    }

    if (lowerQuestion.includes('wavy') || lowerQuestion.includes('type 2') || lowerQuestion.includes('2a') || lowerQuestion.includes('2b') || lowerQuestion.includes('2c')) {
      return "Wavy hair (Type 2):\n\nS-shaped pattern.\n\n• 2A: Fine, thin waves\n• 2B: Medium waves, more defined\n• 2C: Thick, coarse, prone to frizz\n\nCare tips:\n• Wash 2-3x per week\n• Lightweight moisture\n• Scrunch while wet\n• Air dry or diffuse on low";
    }

    if (lowerQuestion.includes('curly') || lowerQuestion.includes('type 3') || lowerQuestion.includes('3a') || lowerQuestion.includes('3b') || lowerQuestion.includes('3c')) {
      return "Curly hair (Type 3):\n\nWell-defined spiral curls.\n\n• 3A: Loose, big curls\n• 3B: Springy ringlets\n• 3C: Tight corkscrew curls\n\nCare tips:\n• Wash 1-2x per week\n• Deep condition weekly\n• Never brush dry\n• Use curl creams\n• Silk/satin pillowcase";
    }

    if (lowerQuestion.includes('kinky') || lowerQuestion.includes('coily') || lowerQuestion.includes('type 4') || lowerQuestion.includes('4a') || lowerQuestion.includes('4b') || lowerQuestion.includes('4c')) {
      return "Kinky/Coily hair (Type 4):\n\nTight coils, zigzag patterns.\n\n• 4A: Soft, tight coils\n• 4B: Z-pattern, sharp angles\n• 4C: Very tight, fragile, high shrinkage\n\nCare tips:\n• Wash once a week or less\n• Maximum moisture\n• Protective styles\n• Gentle detangling\n• Rich oils and butters";
    }

    if (lowerQuestion.includes('damage') || lowerQuestion.includes('breakage') || lowerQuestion.includes('heat') || lowerQuestion.includes('chemical')) {
      return "Hair damage:\n\nCommon causes:\n• Heat styling without protection\n• Chemical treatments\n• Rough handling\n• Environmental factors\n• Lack of moisture\n\nRecovery:\n• Deep conditioning weekly\n• Trim damaged ends\n• Gentle handling\n• Minimize heat/chemicals\n• Use our app to track progress!";
    }

    if (lowerQuestion.includes('hair type') || lowerQuestion.includes('what type')) {
      return "There are 4 main hair types:\n\n• Type 1: Straight\n• Type 2: Wavy\n• Type 3: Curly\n• Type 4: Kinky/Coily\n\nEach has sub-categories (A, B, C).\n\nUse our app's detection feature to identify YOUR hair type!";
    }

    return "I can help you with hair types, damage, care routines, natural remedies, and hair health tips! Could you rephrase your question?\n\nTry asking:\n• 'How often should I wash wavy hair?'\n• 'Is trimming good for growth?'\n• 'How to protect hair from sun?'\n• 'Are natural remedies better?'";
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Get AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 500);

    setInputText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#FFF2E4]"
      keyboardVerticalOffset={0}>
      
      {/* Header */}
      <View className="flex-row items-center w-full h-[25vh] bg-[#3F2305] rounded-b-3xl justify-center">
          <Pressable onPress={() => router.push('/homepage')} className="absolute left-7">
            <Image
              source={require('../assets/images/arrow.png')}
              style={{ width: width * 0.07, height: height, marginTop: height * -0.09}}
              resizeMode="contain"/>
          </Pressable>
          
          <Text className="text-[#FAF7F0] text-3xl font-bold -mt-20 self-center">PocketSalon Assistant</Text>
          {/* to center text */}
          <View className="absolute items-center justify-center mt-16 px-10">
            <Text className="text-[#FAF7F0] text-m ml-15 text-center">Ask about hair types, care routines & health tips</Text>
            <Text className="text-[#FAF7F0] text-s italic text-wrap-pretty w-96 mt-3 text-center">Disclaimer: This application is experimental. Consult an expert.</Text>
          </View>
        </View>
        <Text className="text-[#FAF7F0] text-sm ml-10">Ask about hair types, care routines & health tips</Text>
      {/* Messages */}
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

      {/* Input */}
      <View className="bg-white border-t border-[#DFD7BF] px-4 py-3 flex-row items-center">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask me anything about hair care..."
          placeholderTextColor="#3F2305"
          className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-4 mr-2 text-base mb-5"
          multiline
          maxLength={200}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <Pressable onPress={sendMessage} className="bg-[#3F2305] rounded-full items-center justify-center mb-4"   
          style={{width: 50, height: 50 }}>
            <Image
              source={require('../assets/images/arrow.png')}
              style={{ width: '50%', height: '50%', resizeMode: 'contain', transform: [{ rotate: '180deg' }]}}
              resizeMode="contain"/>
          </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

