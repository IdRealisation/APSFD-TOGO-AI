import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  Upload, 
  LogOut, 
  Send, 
  FileText, 
  CheckCircle, 
  PlayCircle, 
  Award, 
  BarChart3, 
  Menu,
  X,
  User,
  Lock,
  FileSpreadsheet,
  Loader2,
  CreditCard,
  AlertCircle,
  History
} from 'lucide-react';

// --- CONFIGURATION ---
const N8N_WEBHOOKS = {
  // Webhook d'authentification (à remplacer par votre endpoint réel)
  AUTH: "https://findata.app.n8n.cloud/webhook-test/f243195e-1906-4d57-b61f-b5b07bfae132",
  // Webhook pour le chat général
  CHAT_GENERAL: "https://findata.app.n8n.cloud/webhook-test/0ecf3743-4980-442b-881a-fac4012bc317",
  // Webhook pour le chat CEI (confidentiel)
  CHAT_CEI: "https://findata.app.n8n.cloud/webhook-test/450cc2f1-f937-46e2-a9f5-f1782f7dbe64",
  // Webhook pour l'upload de fichiers
  UPLOAD: "https://findata.app.n8n.cloud/webhook-test/10f07f10-696b-40f0-8920-e430a2634adc",
  // Webhook de suivi de progression (à implémenter)
  PROGRESS: "https://votre-n8n.com/webhook/progress" 
};

// --- COMPOSANTS UTILITAIRES ---

/**
 * Composant de Bouton stylisé avec Tailwind CSS.
 * @param {object} props - Les propriétés du composant.
 */
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-green-700 hover:bg-green-800 text-white shadow-md hover:shadow-lg",
    secondary: "bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold",
    outline: "border-2 border-green-700 text-green-700 hover:bg-green-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * Composant Card pour l'encadrement des sections.
 * @param {object} props - Les propriétés du composant.
 */
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

// --- COMPOSANTS DE VUE ---

// 1. LOGIN SCREEN
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Tentative d'authentification via le Webhook N8N
      const response = await fetch(N8N_WEBHOOKS.AUTH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const responseText = await response.text();
      
      if (response.ok) {
        let authData;
        try {
          authData = JSON.parse(responseText);
        } catch (e) {
          // Si la réponse n'est pas du JSON, on assume un succès simple
          authData = { success: true, name: "Utilisateur APSFD", email: email, role: "Agent de Crédit" };
        }
        
        // Logique de validation
        if (authData.success) {
          onLogin({ 
            name: authData.name || "Utilisateur APSFD", 
            email: authData.email || email, 
            role: authData.role || "Agent de Crédit" 
          });
        } else {
          // Afficher le message d'erreur retourné par le webhook
          setError(authData.error || "Identifiants incorrects ou accès refusé.");
        }
      } else {
        // Erreur HTTP (4xx, 5xx)
        setError("Erreur de connexion au serveur d'authentification.");
      }
    } catch (error) {
      console.error("Login API Error:", error);
      setError("Erreur réseau. Veuillez vérifier votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-yellow-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-green-700 p-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">APSFD-TOGO AI</h1>
          <p className="text-green-100 mt-2">Portail de formation & assistance</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Professionnel</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="exemple@apsfd-togo.tg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Se connecter'}
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-gray-400">
            Accès sécurisé via validation N8N
          </p>
        </div>
      </div>
    </div>
  );
};

// 2. UNIVERSAL CHAT INTERFACE 
/**
 * Composant d'interface de chat pour les conversations AI.
 * @param {object} props - Les propriétés du composant.
 */
const ChatInterface = ({ user, mode = 'general', messages, setMessages }) => {
  const config = {
    general: {
      placeholder: "Posez votre question sur la comptabilité, l'audit...",
      webhook: N8N_WEBHOOKS.CHAT_GENERAL,
      userBubbleColor: "bg-green-700",
    },
    cei: {
      placeholder: "Rechercher un client (Nom, ID, Dossier)...",
      webhook: N8N_WEBHOOKS.CHAT_CEI,
      userBubbleColor: "bg-red-700", 
    }
  };

  const currentConfig = config[mode];
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Afficher le message utilisateur immédiatement via setMessages du parent
    const userMsg = { id: Date.now(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    
    const messageToSend = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(currentConfig.webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: messageToSend,
          sender: user.email,
          mode: mode,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const responseText = await response.text();
      let aiResponseText = "Réponse vide.";

      // Tentative de parser la réponse N8N qui peut être en JSON ou en texte simple
      try {
        if (responseText && responseText.trim().length > 0) {
          const data = JSON.parse(responseText);
          if (data && typeof data === 'object') {
            if (data.output && typeof data.output === 'string') aiResponseText = data.output;
            else if (data.text) aiResponseText = data.text;
            else if (data.message) aiResponseText = data.message;
            else if (data.response) aiResponseText = data.response;
            else aiResponseText = JSON.stringify(data);
          } else {
            aiResponseText = String(data);
          }
        }
      } catch (e) {
        if (responseText) aiResponseText = responseText;
      }

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: aiResponseText, 
        sender: 'ai', 
        timestamp: new Date() 
      }]);

    } catch (error) {
      console.error("Erreur API:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "⚠️ Erreur de connexion au serveur N8N.", 
        sender: 'ai', 
        timestamp: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {mode === 'cei' && (
        <div className="bg-red-50 border-b border-red-100 p-3 flex items-center gap-2 text-red-700 text-sm font-medium rounded-t-xl">
          <AlertCircle size={16} />
          Zone Centrale d'Information - Données Confidentielles
        </div>
      )}

      {/* Zone de messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 ${mode === 'general' ? 'rounded-t-xl' : ''}`}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              msg.sender === 'user' 
                ? `${currentConfig.userBubbleColor} text-white rounded-br-none` 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
              <span className={`text-[10px] mt-2 block ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {/* Indicateur de frappe (Typing indicator) */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="bg-white p-4 border-t border-gray-200 rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={currentConfig.placeholder}
            className={`flex-1 border border-gray-300 rounded-full px-6 py-3 focus:ring-2 focus:border-transparent outline-none ${
              mode === 'cei' ? 'focus:ring-red-500' : 'focus:ring-green-500'
            }`}
          />
          <button 
            onClick={handleSend}
            className={`${mode === 'cei' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white p-3 rounded-full transition-colors shadow-md`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. TRAINING MODULE
const TrainingModule = () => {
  const [modules, setModules] = useState([
    { id: 1, title: "Fondamentaux Comptabilité", category: "Comptabilité", progress: 100, status: "validated", content: "video" },
    { id: 2, title: "Audit Interne : Niveau 1", category: "Audit", progress: 45, status: "in_progress", content: "ppt" },
    { id: 3, title: "Gestion des Tontines", category: "Tontine", progress: 0, status: "locked", content: "mixed" },
    { id: 4, title: "Analyse Risque Crédit", category: "Crédit", progress: 10, status: "in_progress", content: "video" },
  ]);

  const [activeModule, setActiveModule] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const startQuiz = (mod) => {
    setActiveModule(mod);
    setShowQuiz(true);
  };

  const finishQuiz = () => {
    // Simuler la validation du quiz et la mise à jour de la progression
    const updatedModules = modules.map(m => 
      m.id === activeModule.id ? { ...m, progress: 100, status: 'validated' } : m
    );
    setModules(updatedModules);
    setShowQuiz(false);
    setActiveModule(null);
  };

  // Vue du Quiz
  if (showQuiz && activeModule) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Quiz: {activeModule.title}</h2>
        <div className="space-y-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="font-medium mb-4">Question 1 : Quel est le ratio de liquidité minimum recommandé ?</p>
            <div className="space-y-2">
              {/* Options du quiz (simulées) */}
              {['10%', '50%', '75%', '100%'].map((opt, i) => (
                <label key={i} className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer">
                  <input type="radio" name="q1" className="text-green-600 focus:ring-green-500" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4">
             <Button variant="ghost" onClick={() => setShowQuiz(false)}>Annuler</Button>
             <Button onClick={finishQuiz}>Soumettre les réponses</Button>
          </div>
        </div>
      </div>
    );
  }

  // Vue de la liste des modules
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Carte des points */}
        <Card className="bg-gradient-to-br from-green-700 to-green-600 text-white border-none relative overflow-hidden">
          <h3 className="text-green-100 text-sm font-medium uppercase">Points Cumulés</h3>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-bold">145</span>
            <span className="text-sm mb-1">pts</span>
          </div>
          <Award className="absolute top-6 right-6 h-8 w-8 text-green-400 opacity-50" />
        </Card>
        {/* Carte de validation */}
        <Card>
          <h3 className="text-gray-500 text-sm font-medium uppercase">Modules Validés</h3>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-bold text-green-700">{modules.filter(m => m.status === 'validated').length}</span>
            <span className="text-sm text-gray-400 mb-1">/ {modules.length}</span>
          </div>
        </Card>
        {/* Carte de progression */}
        <Card>
          <h3 className="text-gray-500 text-sm font-medium uppercase">Prochain Niveau</h3>
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 w-[45%]"></div> {/* Progression simulée à 45% */}
          </div>
          <p className="text-xs text-gray-400 mt-2">45 pts restants pour "Expert Senior"</p>
        </Card>
      </div>

      {/* Liste des modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <Card key={mod.id} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                {mod.category}
              </span>
              {mod.status === 'validated' && <CheckCircle className="text-green-500 h-5 w-5" />}
              {mod.status === 'locked' && <Lock className="text-gray-400 h-5 w-5" />}
            </div>
            
            <h4 className="text-lg font-bold text-gray-800 mb-2">{mod.title}</h4>
            
            {/* Icônes de contenu */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1"><FileText size={14}/> PPT</span>
              <span className="flex items-center gap-1"><PlayCircle size={14}/> Vidéo</span>
            </div>

            {/* Barre de progression */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">{mod.progress}% complété</span>
                <span className="text-gray-400">{mod.progress}/100 pts</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${mod.progress === 100 ? 'bg-green-500' : 'bg-yellow-400'}`} 
                  style={{ width: `${mod.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="mt-6 flex gap-2">
              {mod.status === 'validated' ? (
                 <Button variant="outline" className="w-full text-sm">Revoir</Button>
              ) : mod.status === 'locked' ? (
                <Button disabled className="w-full text-sm opacity-70">Bloqué</Button>
              ) : (
                <>
                  <Button className="flex-1 text-sm" onClick={() => {}}>Voir Cours</Button>
                  <Button variant="secondary" className="text-sm" onClick={() => startQuiz(mod)}>Quiz</Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 4. UPLOAD MODULE 
/**
 * Composant de dépôt de fichiers.
 * @param {object} props - Les propriétés du composant.
 */
const UploadModule = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Gestion des événements de glisser-déposer
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    // Stocker le fichier brut (rawFile) pour l'envoi
    const newFiles = Array.from(fileList).map(file => ({
      rawFile: file, 
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type,
      status: 'pending'
    }));
    setFiles([...files, ...newFiles]);
  };

  // Fonction d'envoi des fichiers via N8N
  const triggerUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData();
    // Ajouter tous les fichiers au FormData
    files.forEach((fileObj) => {
      formData.append('files', fileObj.rawFile, fileObj.name); // Inclure le nom pour N8N
    });

    try {
      // Envoi du FormData au webhook N8N
      const response = await fetch(N8N_WEBHOOKS.UPLOAD, {
        method: 'POST',
        body: formData,
        // Content-Type n'est PAS défini, car FormData s'en charge avec le "boundary"
      });

      if (response.ok) {
        // Optionnel : vérifier si N8N retourne un succès spécifique
        // const result = await response.json(); 
        setSuccessMsg("Fichiers transmis avec succès au workflow N8N !");
        setFiles([]);
      } else {
        throw new Error("Erreur serveur lors de l'upload");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Échec de l'envoi. Vérifiez la configuration du webhook.");
    } finally {
      setUploading(false);
      setTimeout(() => { setSuccessMsg(''); setErrorMsg(''); }, 5000); // Masquer le message après 5s
    }
  };

  // Fonction pour retirer un fichier de la liste d'attente
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };


  return (
    <div className="max-w-3xl mx-auto">
      {/* Zone de Drag and Drop */}
      <div 
        className={`relative p-10 border-2 border-dashed rounded-2xl text-center transition-colors ${
          dragActive ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Input caché pour cliquer et sélectionner */}
        <input 
          type="file" 
          multiple 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept=".pdf,.xlsx,.xls,.csv"
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <Upload className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">Glissez vos fichiers ici</p>
            <p className="text-sm text-gray-500 mt-1">PDF ou Excel (Max 10MB par fichier)</p>
          </div>
          <Button variant="outline" className="pointer-events-none">Parcourir les fichiers</Button>
        </div>
      </div>

      {/* Messages de statut */}
      {successMsg && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
          <CheckCircle size={20} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} /> {errorMsg}
        </div>
      )}

      {/* Liste des fichiers en attente */}
      {files.length > 0 && (
        <div className="mt-8 space-y-3">
          <h3 className="font-medium text-gray-700">Fichiers en attente ({files.length})</h3>
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                {/* Icône basée sur l'extension */}
                {file.name.endsWith('xls') || file.name.endsWith('xlsx') || file.name.endsWith('csv') ? (
                  <FileSpreadsheet className="text-green-600" />
                ) : (
                  <FileText className="text-red-500" />
                )}
                <div>
                  <p className="font-medium text-sm text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-400">{file.size}</p>
                </div>
              </div>
              <Button variant="danger" size="sm" onClick={() => removeFile(idx)}>
                Retirer
              </Button>
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button onClick={triggerUpload} disabled={uploading}>
              {uploading ? <Loader2 className="animate-spin" /> : 'Envoyer pour traitement'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// 5. HISTORIQUE TAB
const HistoryTab = ({ generalHistory, ceiHistory }) => {
  // Combiner les deux historiques et les trier par date (plus récent en premier)
  const allMessages = [
    ...generalHistory.map(m => ({...m, type: 'Assistant AI'})), 
    ...ceiHistory.map(m => ({...m, type: 'Centrale CEI'}))
  ].sort((a, b) => b.timestamp - a.timestamp); 

  return (
    <div className="space-y-6">
       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
         <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
           <History className="text-green-600" />
           Historique de la Session en Cours
         </h3>
         <p className="text-sm text-gray-500 mb-6">
           Retrouvez ici tous les échanges effectués depuis votre connexion.
         </p>

         <div className="space-y-4">
           {allMessages.length === 0 ? (
             <p className="text-center text-gray-400 py-8">Aucune conversation pour le moment.</p>
           ) : (
             allMessages.map((msg) => (
               <div key={msg.id} className={`p-4 rounded-lg border-l-4 ${msg.sender === 'user' ? 'bg-gray-50 border-gray-300' : 'bg-white border-green-500 shadow-sm'}`}>
                 <div className="flex justify-between items-start mb-1">
                   {/* Badge pour identifier le mode de chat */}
                   <span className={`text-xs font-bold px-2 py-1 rounded ${msg.type === 'Centrale CEI' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                     {msg.type}
                   </span>
                   <span className="text-xs text-gray-400">
                     {msg.timestamp.toLocaleTimeString()}
                   </span>
                 </div>
                 <p className="text-sm text-gray-800 mt-2 font-medium">{msg.sender === 'user' ? 'Vous' : 'IA'}:</p>
                 <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{msg.text}</p>
               </div>
             ))
           )}
         </div>
       </div>
    </div>
  );
}

// --- LAYOUT PRINCIPAL (App Component) ---

export default function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // État des historiques "lifté" vers le composant parent pour persistance
  const [chatHistories, setChatHistories] = useState({
    general: [],
    cei: []
  });

  // Initialisation des messages de bienvenue lors de la connexion
  useEffect(() => {
    if (user) {
      if (chatHistories.general.length === 0) {
        setChatHistories(prev => ({
          ...prev,
          general: [{ 
            id: 'init-gen', 
            text: `Bonjour ${user.name.split(' ')[0]}, je suis l'IA de l'APSFD. Comment puis-je vous aider aujourd'hui ?`, 
            sender: 'ai', 
            timestamp: new Date() 
          }]
        }));
      }
      if (chatHistories.cei.length === 0) {
        setChatHistories(prev => ({
          ...prev,
          cei: [{ 
            id: 'init-cei', 
            text: `Bienvenue sur la Centrale d'Échange d'Information (CEI).`, 
            sender: 'ai', 
            timestamp: new Date() 
          }]
        }));
      }
    }
  }, [user]);

  // Helper pour mettre à jour l'historique spécifique (utilisé par ChatInterface)
  const updateHistory = (mode, updater) => {
    setChatHistories(prev => {
      const currentList = prev[mode];
      const newList = typeof updater === 'function' ? updater(currentList) : updater;
      return { ...prev, [mode]: newList };
    });
  };

  // 1. Affichage de l'écran de connexion si l'utilisateur n'est pas connecté
  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  // 2. Fonction pour rendre le contenu de l'onglet actif
  const renderContent = () => {
    switch (currentTab) {
      case 'chat': 
        return <ChatInterface 
          user={user} 
          mode="general" 
          messages={chatHistories.general} 
          setMessages={(val) => updateHistory('general', val)} 
        />;
      case 'cei': 
        return <ChatInterface 
          user={user} 
          mode="cei" 
          messages={chatHistories.cei} 
          setMessages={(val) => updateHistory('cei', val)} 
        />;
      case 'formation': return <TrainingModule />;
      case 'depot': return <UploadModule />;
      case 'historique': 
        return <HistoryTab generalHistory={chatHistories.general} ceiHistory={chatHistories.cei} />;
      default: 
        return <ChatInterface 
          user={user} 
          mode="general" 
          messages={chatHistories.general} 
          setMessages={(val) => updateHistory('general', val)} 
        />;
    }
  };

  // Composant pour les éléments de navigation
  const NavItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => { setCurrentTab(id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        currentTab === id 
          ? 'bg-yellow-400 text-green-900 font-bold shadow-sm' 
          : 'text-green-100 hover:bg-green-800/50'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-green-700 text-white shadow-xl z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-green-800">AI</div>
            APSFD-TOGO
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem id="chat" label="Assistant AI" icon={MessageSquare} />
          <NavItem id="cei" label="Centrale CEI" icon={CreditCard} /> 
          <NavItem id="formation" label="Formation" icon={BookOpen} />
          <NavItem id="depot" label="Dépôt Fichiers" icon={Upload} />
          <NavItem id="historique" label="Historique" icon={BarChart3} />
        </nav>

        <div className="p-4 border-t border-green-600">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center text-xs font-bold">
              {user.name.charAt(0)} {/* Initiale de l'utilisateur */}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-green-300 truncate">{user.role}</p>
            </div>
            <button onClick={() => setUser(null)} className="text-green-300 hover:text-white">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="md:hidden bg-green-700 text-white p-4 flex items-center justify-between shadow-md">
          <span className="font-bold text-lg">APSFD-TOGO AI</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 bg-green-700 z-50 flex flex-col p-4 md:hidden">
            <div className="flex justify-end mb-8">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white"><X size={24} /></button>
            </div>
            <nav className="space-y-4 text-white">
              <NavItem id="chat" label="Assistant AI" icon={MessageSquare} />
              <NavItem id="cei" label="Centrale CEI" icon={CreditCard} />
              <NavItem id="formation" label="Formation" icon={BookOpen} />
              <NavItem id="depot" label="Dépôt Fichiers" icon={Upload} />
              <NavItem id="historique" label="Historique" icon={BarChart3} />
              <button onClick={() => setUser(null)} className="w-full flex items-center gap-3 px-4 py-3 text-red-300">
                <LogOut size={20} /> Déconnexion
              </button>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8 relative">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            {/* Titre de l'onglet actif */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 capitalize">
                {currentTab === 'depot' ? 'Dépôt de documents' : currentTab === 'cei' ? 'Centrale d\'Échange d\'Information' : currentTab === 'historique' ? 'Historique des activités' : currentTab}
              </h2>
            </div>
            
            {/* Contenu de l'onglet */}
            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}