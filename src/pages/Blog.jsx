import { useEffect, useState } from "react";
import { Link } from "react-router";
import HealthInsights from "../components/HealthInsights";
import Loader from "../components/Loader";
import PageTitle from "../components/PageTitle";
import useAxiosPublic from "../hooks/axiosPublic";

export default function Blog() {
  const axiosPublic = useAxiosPublic();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false); // Initialize as false to skip loader

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        const res = await axiosPublic.get("/get-blogs-public");
        if (isMounted) {
          setBlogs(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        if (isMounted) {
          setBlogs([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, [axiosPublic]);

  const staticBlogs = [
    {
      _id: "static-en-1",
      title: "Why Regular Blood Donation Matters",
      thumbnail:
        "https://images.pexels.com/photos/6823563/pexels-photo-6823563.jpeg?auto=compress&cs=tinysrgb&w=600",
      content:
        "<p>Blood donation is one of the most selfless acts a person can perform, and doing it regularly every 3–4 months plays a crucial role in maintaining adequate supplies at national blood banks. These reserves are essential for handling emergencies like road accidents, natural disasters, and mass casualty events where multiple patients need immediate transfusions. Beyond emergencies, blood is constantly needed for scheduled surgeries including organ transplants, cardiac procedures, and cesarean deliveries. Cancer patients undergoing chemotherapy often require regular blood transfusions as their treatment can significantly reduce healthy blood cell production.</p><p>What makes regular donation even more remarkable is its multiplier effect on saving lives. A single unit of donated blood can be separated into different components—red blood cells, platelets, and plasma—each serving different medical purposes. This means one donation can potentially save up to three different patients. Healthy donors with stable hemoglobin levels (typically above 12.5 g/dL for women and 13.0 g/dL for men) and normal blood pressure can safely donate without any adverse effects on their health. In fact, regular donation can have health benefits for the donor, including reduced iron overload and cardiovascular benefits. The entire process takes less than an hour, but its impact resonates through multiple families who get their loved ones back because someone chose to donate.</p>",
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "static-bn-1",
      title: "রক্তদান কেন গুরুত্বপূর্ণ?",
      thumbnail:
        "https://images.pexels.com/photos/6285073/pexels-photo-6285073.jpeg?auto=compress&cs=tinysrgb&w=600",
      content:
        "<p>প্রতি ৩–৪ মাস অন্তর স্বেচ্ছায় রক্তদান করা একটি মহৎ কাজ যা জাতীয় রক্তভান্ডারকে সবসময় প্রস্তুত রাখে। এই রক্তের মজুদ অত্যন্ত জরুরি যখন সড়ক দুর্ঘটনা, প্রাকৃতিক দুর্যোগ বা হঠাৎ বড় ধরনের জরুরি পরিস্থিতিতে অনেক রোগীর একসাথে রক্তের প্রয়োজন হয়। এছাড়াও নিয়মিত অস্ত্রোপচার যেমন হার্ট সার্জারি, অঙ্গ প্রতিস্থাপন, সিজারিয়ান ডেলিভারি এবং ক্যান্সার রোগীদের কেমোথেরাপির সময় নিয়মিত রক্ত সঞ্চালনের প্রয়োজন হয়। ক্যান্সার চিকিৎসার ফলে রোগীর শরীরে সুস্থ রক্তকণিকা কমে যায়, তাই তাদের বারবার রক্ত দিতে হয়।</p><p>আরও উল্লেখযোগ্য বিষয় হলো, এক ব্যাগ রক্ত বিভিন্ন উপাদানে আলাদা করা যায়—লোহিত রক্তকণিকা, প্লেটলেট এবং প্লাজমা—যা বিভিন্ন রোগীর বিভিন্ন চিকিৎসায় ব্যবহৃত হয়। এর মানে একজনের দান করা রক্ত দিয়ে তিনজন পর্যন্ত রোগীর জীবন বাঁচানো সম্ভব। যাদের হিমোগ্লোবিন স্বাভাবিক (মহিলাদের ১২.৫ গ্রাম/ডেসিলিটার এবং পুরুষদের ১৩.০ গ্রাম/ডেসিলিটারের উপরে) এবং রক্তচাপ নিয়ন্ত্রণে আছে, তারা নিরাপদে রক্তদান করতে পারেন। নিয়মিত রক্তদান দাতার নিজের স্বাস্থ্যের জন্যও উপকারী—এতে শরীরে অতিরিক্ত আয়রন জমা কমে এবং হৃদরোগের ঝুঁকি হ্রাস পায়। পুরো প্রক্রিয়া এক ঘণ্টারও কম সময় নেয়, কিন্তু এর প্রভাব অসংখ্য পরিবারে পৌঁছায় যারা তাদের প্রিয়জনকে ফিরে পায় শুধুমাত্র কারণ কেউ রক্তদান করার সিদ্ধান্ত নিয়েছিল। এটি সত্যিকারের একটি বড় সাদকাহ ও মানবসেবার কাজ।</p>",
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "static-en-2",
      title: "Preparing Your Body Before Donating Blood",
      thumbnail:
        "https://images.pexels.com/photos/3957987/pexels-photo-3957987.jpeg?auto=compress&cs=tinysrgb&w=600",
      content:
        "<p>Proper preparation before blood donation is essential to ensure both your safety and the quality of the blood being donated. Hydration is the cornerstone of preparation—start drinking extra water at least 24 hours before your scheduled donation. Aim for 8–10 glasses of water throughout the day leading up to your appointment. This helps maintain your blood volume and makes the donation process smoother while reducing the likelihood of feeling dizzy or faint afterward. Getting adequate rest is equally important; try to sleep 6–8 hours the night before donation. A well-rested body handles the donation process much better and recovers faster.</p><p>Your diet in the days before donation matters significantly. Focus on iron-rich foods like leafy green vegetables (spinach, kale), lentils, beans, red meat, chicken, fish, and iron-fortified cereals. These help maintain healthy hemoglobin levels. On the day of donation, eat a substantial meal 2–3 hours beforehand, but avoid excessively oily, fatty, or fried foods as these can affect blood quality and make you feel nauseous during or after donation. Never donate on an empty stomach. If you've donated before, bring your donation card or any records showing your blood type and previous donation dates—this helps medical staff assess your eligibility and monitor appropriate donation intervals. Finally, avoid alcohol for 24 hours before donation and don't smoke for at least an hour before and after the procedure. Following these guidelines ensures you have a safe, comfortable donation experience.</p>",
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "static-bn-2",
      title: "রক্তদানের আগে কীভাবে প্রস্তুতি নেবেন?",
      thumbnail:
        "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=600",
      content:
        "<p>রক্তদানের আগে সঠিক প্রস্তুতি নেওয়া অত্যন্ত জরুরি যাতে আপনার নিরাপত্তা এবং রক্তের মান উভয়ই নিশ্চিত হয়। প্রস্তুতির মূল ভিত্তি হলো পর্যাপ্ত পানি পান করা—রক্তদানের অন্তত ২৪ ঘণ্টা আগে থেকে বেশি করে পানি পান শুরু করুন। দিনভর ৮–১০ গ্লাস পানি পান করার চেষ্টা করুন। এটি আপনার রক্তের পরিমাণ ঠিক রাখে এবং রক্তদানের পরে মাথা ঘোরা বা দুর্বলতার সম্ভাবনা কমায়। পর্যাপ্ত ঘুম সমানভাবে গুরুত্বপূর্ণ—রক্তদানের আগের রাতে ৬–৮ ঘণ্টা ঘুমানোর চেষ্টা করুন। ভালো বিশ্রাম নেওয়া শরীর রক্তদান প্রক্রিয়া অনেক ভালোভাবে সামলাতে পারে এবং দ্রুত সুস্থ হয়ে ওঠে।</p><p>রক্তদানের আগের কয়েকদিনের খাবার তালিকা খুবই গুরুত্বপূর্ণ। আয়রনসমৃদ্ধ খাবার খাওয়ার দিকে মনোযোগ দিন যেমন শাকসবজি (পালংশাক, লাল শাক), ডাল, বিন, লাল মাংস, মুরগির মাংস, মাছ এবং আয়রন-যুক্ত সিরিয়াল। এগুলো হিমোগ্লোবিন লেভেল ভালো রাখতে সাহায্য করে। রক্তদানের দিন, দান করার ২–৩ ঘণ্টা আগে ভালো খাবার খান, কিন্তু অতিরিক্ত তেল, চর্বিযুক্ত বা ভাজাপোড়া খাবার এড়িয়ে চলুন কারণ এগুলো রক্তের মান প্রভাবিত করতে পারে এবং রক্তদানের সময় বা পরে বমি ভাব হতে পারে। কখনোই খালি পেটে রক্তদান করবেন না। যদি আপনি আগে রক্তদান করে থাকেন, তাহলে আপনার ডোনেশন কার্ড বা রক্তের গ্রুপ এবং আগের রক্তদানের তারিখ দেখানো কাগজপত্র সাথে নিয়ে আসুন—এটি চিকিৎসক দলকে আপনার যোগ্যতা যাচাই করতে এবং সঠিক সময়ের ব্যবধান মনিটর করতে সাহায্য করে। সবশেষে, রক্তদানের ২৪ ঘণ্টা আগে অ্যালকোহল এড়িয়ে চলুন এবং রক্তদানের কমপক্ষে এক ঘণ্টা আগে ও পরে ধূমপান করবেন না। এই নির্দেশনাগুলো মেনে চললে আপনার রক্তদান অভিজ্ঞতা নিরাপদ ও আরামদায়ক হবে।</p>",
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "static-en-3",
      title: "Everyday Habits for a Heart-Healthy Life",
      thumbnail:
        "https://images.pexels.com/photos/6941881/pexels-photo-6941881.jpeg?auto=compress&cs=tinysrgb&w=600",
      content:
        "<p>Maintaining cardiovascular health doesn't require extreme measures—it's built on consistent, manageable daily habits that compound over time. Physical activity is the foundation of heart health. Aim to move your body for at least 30 minutes every day, whether through brisk walking, cycling, swimming, dancing, or light jogging. These moderate-intensity activities strengthen your heart muscle, improve blood vessel flexibility, enhance circulation, and help maintain healthy body weight. The beauty of this approach is its accessibility—you don't need expensive gym memberships or equipment. A daily walk in your neighborhood, taking stairs instead of elevators, or playing with children can all contribute to your 30-minute goal. Regular physical activity also helps control blood pressure, reduces LDL (bad) cholesterol while increasing HDL (good) cholesterol, and improves insulin sensitivity, thereby reducing diabetes risk.</p><p>Nutrition and lifestyle choices work hand-in-hand with physical activity to protect your heart. Focus on whole, minimally processed foods—plenty of vegetables, fruits, whole grains, lean proteins, and healthy fats from sources like fish, nuts, and olive oil. Limit ultra-processed foods that are high in added sugars, unhealthy fats, and excessive sodium, as these contribute to hypertension, obesity, and arterial plaque buildup. Smoking is one of the most damaging habits for cardiovascular health, significantly increasing heart attack and stroke risk, so avoiding tobacco in any form is critical. Proper hydration with adequate water intake (around 8 glasses daily) helps maintain blood volume and prevents blood from becoming too viscous. Finally, prioritize 7–8 hours of quality sleep each night—chronic sleep deprivation is linked to increased inflammation, elevated blood pressure, and greater cardiovascular disease risk. These interconnected habits create a lifestyle that naturally supports your heart, blood vessels, and overall health throughout your life.</p>",
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "static-bn-3",
      title: "সুস্থ রক্ত ও সুস্থ শরীরের জন্য দৈনন্দিন অভ্যাস",
      thumbnail:
        "https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg?auto=compress&cs=tinysrgb&w=600",
      content:
        "<p>হৃদযন্ত্রের সুস্থতা বজায় রাখতে কোনো চরম ব্যবস্থার প্রয়োজন নেই—এটি তৈরি হয় ধারাবাহিক, সহজসাধ্য দৈনন্দিন অভ্যাসের মাধ্যমে যা সময়ের সাথে সাথে শক্তিশালী প্রভাব ফেলে। শারীরিক কার্যকলাপ হৃদযন্ত্রের স্বাস্থ্যের ভিত্তি। প্রতিদিন অন্তত ৩০ মিনিট শরীর চালনা করার লক্ষ্য রাখুন, হোক সেটা দ্রুত হাঁটা, সাইক্লিং, সাঁতার, নাচ বা হালকা দৌড়ানোর মাধ্যমে। এই মাঝারি-তীব্রতার কার্যক্রম আপনার হৃদপেশী শক্তিশালী করে, রক্তনালীর নমনীয়তা উন্নত করে, রক্ত সঞ্চালন বৃদ্ধি করে এবং স্বাস্থ্যকর ওজন বজায় রাখতে সহায়তা করে। এই পদ্ধতির সৌন্দর্য হলো এর সহজলভ্যতা—আপনার ব্যয়বহুল জিম সদস্যপদ বা সরঞ্জামের প্রয়োজন নেই। আপনার আশেপাশে প্রতিদিন হাঁটা, লিফটের পরিবর্তে সিঁড়ি ব্যবহার করা, বা বাচ্চাদের সাথে খেলা—সবই আপনার ৩০ মিনিটের লক্ষ্যে অবদান রাখতে পারে। নিয়মিত শারীরিক কার্যকলাপ রক্তচাপ নিয়ন্ত্রণে সাহায্য করে, এলডিএল (খারাপ) কোলেস্টেরল কমায় এবং এইচডিএল (ভালো) কোলেস্টেরল বৃদ্ধি করে, এবং ইনসুলিন সংবেদনশীলতা উন্নত করে যা ডায়াবেটিসের ঝুঁকি হ্রাস করে।</p><p>পুষ্টি এবং জীবনযাত্রার পছন্দ শারীরিক কার্যকলাপের সাথে মিলে আপনার হৃদযন্ত্র রক্ষা করে। সম্পূর্ণ, ন্যূনতম প্রক্রিয়াজাত খাবারের দিকে মনোনিবেশ করুন—প্রচুর শাকসবজি, ফল, গোটা শস্য, চর্বিহীন প্রোটিন এবং মাছ, বাদাম এবং অলিভ অয়েলের মতো উৎস থেকে স্বাস্থ্যকর চর্বি। অতিরিক্ত চিনি, অস্বাস্থ্যকর চর্বি এবং অতিরিক্ত লবণযুক্ত অতি-প্রক্রিয়াজাত খাবার সীমিত করুন, কারণ এগুলো উচ্চ রক্তচাপ, স্থূলতা এবং ধমনীতে প্লাক জমা হতে অবদান রাখে। ধূমপান হৃদযন্ত্রের স্বাস্থ্যের জন্য সবচেয়ে ক্ষতিকর অভ্যাসগুলির একটি, যা হার্ট অ্যাটাক এবং স্ট্রোকের ঝুঁকি উল্লেখযোগ্যভাবে বৃদ্ধি করে, তাই যেকোনো ধরনের তামাক এড়িয়ে চলা অত্যন্ত গুরুত্বপূর্ণ। পর্যাপ্ত পানি পান (দৈনিক প্রায় ৮ গ্লাস) রক্তের পরিমাণ বজায় রাখতে এবং রক্ত অতিরিক্ত ঘন হওয়া প্রতিরোধ করতে সহায়তা করে। সবশেষে, প্রতি রাতে ৭–৮ ঘণ্টা মানসম্পন্ন ঘুমকে অগ্রাধিকার দিন—দীর্ঘস্থায়ী ঘুমের অভাব প্রদাহ বৃদ্ধি, উচ্চ রক্তচাপ এবং হৃদরোগের ঝুঁকি বৃদ্ধির সাথে যুক্ত। এই পরস্পর সংযুক্ত অভ্যাসগুলো এমন একটি জীবনধারা তৈরি করে যা স্বাভাবিকভাবে আপনার হৃদযন্ত্র, রক্তনালী এবং সামগ্রিক স্বাস্থ্যকে সারা জীবন ধরে সমর্থন করে।</p>",
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "static-en-4",
      title: "Understanding Blood Types and Compatibility",
      thumbnail:
        "https://images.pexels.com/photos/6823566/pexels-photo-6823566.jpeg?auto=compress&cs=tinysrgb&w=600",
      content:
        "<p>Blood type is determined by the presence or absence of certain antigens on the surface of red blood cells. The ABO system classifies blood into four main types: A, B, AB, and O. Additionally, the Rh factor (positive or negative) further categorizes these types, resulting in eight common blood groups: A+, A-, B+, B-, AB+, AB-, O+, and O-. Understanding your blood type is crucial not only for blood donation but also for medical emergencies, surgeries, and pregnancy planning. Each blood type has specific compatibility rules—for example, O- is known as the universal donor because it can be given to patients of any blood type in emergencies, while AB+ is the universal recipient, able to receive blood from any type. However, O- blood is always in high demand and short supply, making O- donors particularly valuable to blood banks.</p><p>When you donate blood, it's essential to know which blood types can safely receive your donation. Type A donors can give to A and AB recipients, Type B donors to B and AB recipients, Type AB donors only to AB recipients (though they're universal recipients), and Type O donors can give to everyone. The Rh factor matters too—Rh-negative blood can be given to both Rh-positive and Rh-negative recipients, but Rh-positive blood should only go to Rh-positive recipients. This is why blood banks carefully test and label all donated blood. Certain blood types are rarer than others; for instance, AB- is one of the rarest types, found in less than 1% of the population, making those donors extremely important. Knowing your blood type empowers you to understand your potential impact as a donor and highlights the critical need for diverse donors across all blood types to ensure hospitals can meet every patient's needs.</p>",
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "static-bn-4",
      title: "রক্তের গ্রুপ এবং সামঞ্জস্যতা বোঝা",
      thumbnail:
        "https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=600",
      content:
        "<p>রক্তের গ্রুপ নির্ধারিত হয় লোহিত রক্তকণিকার পৃষ্ঠে নির্দিষ্ট অ্যান্টিজেনের উপস্থিতি বা অনুপস্থিতির মাধ্যমে। এবিও সিস্টেম রক্তকে চারটি প্রধান গ্রুপে শ্রেণিবদ্ধ করে: এ, বি, এবি এবং ও। এছাড়াও, আরএইচ ফ্যাক্টর (পজিটিভ বা নেগেটিভ) এই গ্রুপগুলোকে আরও শ্রেণিবদ্ধ করে, যার ফলে আটটি সাধারণ রক্তের গ্রুপ তৈরি হয়: এ+, এ-, বি+, বি-, এবি+, এবি-, ও+ এবং ও-। আপনার রক্তের গ্রুপ জানা শুধুমাত্র রক্তদানের জন্যই নয়, বরং চিকিৎসা জরুরি অবস্থা, অস্ত্রোপচার এবং গর্ভাবস্থা পরিকল্পনার জন্যও অত্যন্ত গুরুত্বপূর্ণ। প্রতিটি রক্তের গ্রুপের নির্দিষ্ট সামঞ্জস্যতার নিয়ম রয়েছে—উদাহরণস্বরূপ, ও- কে সর্বজনীন দাতা বলা হয় কারণ জরুরি অবস্থায় এটি যেকোনো রক্তের গ্রুপের রোগীকে দেওয়া যেতে পারে, যেখানে এবি+ হলো সর্বজনীন গ্রহীতা, যে কোনো গ্রুপ থেকে রক্ত নিতে পারে। তবে, ও- রক্ত সবসময় চাহিদা বেশি এবং সরবরাহ কম থাকে, যা ও- দাতাদের রক্তব্যাংকের জন্য বিশেষভাবে মূল্যবান করে তোলে।</p><p>যখন আপনি রক্তদান করেন, তখন জানা জরুরি যে কোন রক্তের গ্রুপগুলো নিরাপদে আপনার দান গ্রহণ করতে পারবে। এ গ্রুপের দাতারা এ এবং এবি গ্রহীতাদের দিতে পারেন, বি গ্রুপের দাতারা বি এবং এবি গ্রহীতাদের দিতে পারেন, এবি গ্রুপের দাতারা শুধুমাত্র এবি গ্রহীতাদের দিতে পারেন (যদিও তারা সর্বজনীন গ্রহীতা), এবং ও গ্রুপের দাতারা সবাইকে দিতে পারেন। আরএইচ ফ্যাক্টরও গুরুত্বপূর্ণ—আরএইচ-নেগেটিভ রক্ত আরএইচ-পজিটিভ এবং আরএইচ-নেগেটিভ উভয় গ্রহীতাকে দেওয়া যেতে পারে, কিন্তু আরএইচ-পজিটিভ রক্ত শুধুমাত্র আরএইচ-পজিটিভ গ্রহীতাদের দেওয়া উচিত। এই কারণেই রক্তব্যাংক সমস্ত দান করা রক্ত সতর্কতার সাথে পরীক্ষা করে এবং লেবেল করে। কিছু রক্তের গ্রুপ অন্যদের তুলনায় বিরল; উদাহরণস্বরূপ, এবি- সবচেয়ে বিরল গ্রুপগুলির একটি, যা জনসংখ্যার ১% এরও কম মানুষের মধ্যে পাওয়া যায়, যা সেই দাতাদের অত্যন্ত গুরুত্বপূর্ণ করে তোলে। আপনার রক্তের গ্রুপ জানা আপনাকে একজন দাতা হিসাবে আপনার সম্ভাব্য প্রভাব বুঝতে ক্ষমতা দেয় এবং সমস্ত রক্তের গ্রুপ জুড়ে বিভিন্ন দাতার জরুরি প্রয়োজনীয়তা তুলে ধরে যাতে হাসপাতালগুলো প্রতিটি রোগীর চাহিদা পূরণ করতে পারে।</p>",
      status: "published",
      createdAt: new Date().toISOString(),
    }
  ];

  const displayBlogs = blogs.length > 0 ? blogs : staticBlogs;

  if (loading) return <Loader label="Loading blogs..." full={true} />;

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden text-slate-400">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-900/20 rounded-full blur-3xl" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <PageTitle title={"Blog"} />

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Blood Donation Blog
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-slate-400">
            Latest news, tips, and information about blood donation
          </p>
        </div>

        {displayBlogs.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl mx-4 backdrop-blur-sm">
            <p className="text-base sm:text-lg text-slate-500">
              No published blogs found.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-lg hover:shadow-slate-900/20 hover:border-slate-700 transition-all duration-300 overflow-hidden group hover:-translate-y-1 flex flex-col"
                >
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="p-5 space-y-3 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-100 group-hover:text-white line-clamp-2 transition-colors">
                      {blog.title}
                    </h3>
                    <div
                      className="text-sm line-clamp-3 text-slate-400 flex-1 prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                    <Link
                      to={`/blog-details/${blog._id}`}
                      className="inline-flex mt-auto text-slate-300 hover:text-white font-medium text-sm items-center gap-1 transition-colors"
                    >
                      Read More
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-16">
              <HealthInsights />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
