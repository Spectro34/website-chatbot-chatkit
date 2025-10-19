# 🚀 ChatKit Helm Chart

A production-ready Helm chart for deploying ChatKit AI chatbot on Kubernetes with customizable deployment options.

## 📋 Features

- **🔧 Flexible Deployment Types**: Ollama-only, OpenAI-only, or Hybrid
- **🌐 Custom Website Support**: Deploy your own website with ChatKit integrated
- **📊 Auto-scaling**: Horizontal Pod Autoscaler for backend
- **🔒 Security**: Pod Security Context, Network Policies, RBAC
- **💾 Persistence**: Persistent storage for Ollama models
- **🌍 Ingress**: Configurable ingress with TLS support
- **📈 Monitoring**: Prometheus metrics and health checks
- **🎨 Customizable**: Extensive configuration options

## 🚀 Quick Start

### Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- kubectl configured

### 1. Add ChatKit Repository

```bash
# Add the ChatKit Helm repository
helm repo add chatkit https://yourusername.github.io/websitechatbot
helm repo update
```

### 2. Deploy with Default Configuration

```bash
# Deploy ChatKit with default settings
helm install chatkit chatkit/chatkit

# Or deploy with custom values
helm install chatkit chatkit/chatkit -f values.yaml
```

### 3. Access Your ChatBot

```bash
# Get the service URL
kubectl get ingress chatkit

# Or port-forward for testing
kubectl port-forward service/chatkit-frontend 8080:80
```

## ⚙️ Configuration

### Deployment Types

#### 1. Ollama-Only Deployment
```bash
helm install chatkit chatkit/chatkit -f examples/values-ollama-only.yaml
```

**Features:**
- Uses local Ollama for AI responses
- No external API costs
- Complete privacy
- Requires more resources

#### 2. OpenAI-Only Deployment
```bash
helm install chatkit chatkit/chatkit -f examples/values-openai-only.yaml
```

**Features:**
- Uses OpenAI API for AI responses
- Faster responses
- Lower resource requirements
- Requires API key

#### 3. Hybrid Deployment (Recommended)
```bash
helm install chatkit chatkit/chatkit -f examples/values-hybrid.yaml
```

**Features:**
- Ollama as primary
- OpenAI as fallback
- Best of both worlds
- High availability

#### 4. Custom Website Deployment
```bash
helm install chatkit chatkit/chatkit -f examples/values-custom-website.yaml
```

**Features:**
- Use your own website
- ChatKit widget integrated
- Full customization
- Production ready

### Configuration Options

#### Backend Configuration
```yaml
backend:
  enabled: true
  replicaCount: 2
  image:
    repository: websitechatbot/chatkit-backend
    tag: "latest"
  resources:
    limits:
      cpu: 1000m
      memory: 1Gi
    requests:
      cpu: 500m
      memory: 512Mi
  env:
    NODE_ENV: "production"
    PORT: 3001
    ALLOWED_ORIGINS: "https://yourdomain.com"
    MAX_REQUESTS_PER_MINUTE: 60
    MAX_REQUESTS_PER_HOUR: 1000
```

#### Frontend Configuration
```yaml
frontend:
  enabled: true
  replicaCount: 2
  customWebsite:
    enabled: false
    image:
      repository: "your-registry/your-website"
      tag: "latest"
  widget:
    theme: "light"
    position: "bottom-right"
    autoOpen: false
    enableTyping: true
    enableSound: false
    maxMessages: 50
```

#### Ollama Configuration
```yaml
ollama:
  enabled: true
  model: "llama2:latest"
  resources:
    limits:
      cpu: 4000m
      memory: 8Gi
    requests:
      cpu: 2000m
      memory: 4Gi
  persistence:
    enabled: true
    size: 50Gi
    storageClass: "fast-ssd"
```

#### OpenAI Configuration
```yaml
openai:
  enabled: true
  apiKey: "sk-proj-your-openai-api-key-here"
  model: "gpt-3.5-turbo"
  maxTokens: 500
  temperature: 0.7
```

#### Ingress Configuration
```yaml
ingress:
  enabled: true
  className: "nginx"
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: chatkit.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
          service: frontend
        - path: /api
          pathType: Prefix
          service: backend
  tls:
    - secretName: chatkit-tls
      hosts:
        - chatkit.yourdomain.com
```

## 🎯 Use Cases

### 1. E-commerce Website
```yaml
# Deploy ChatKit for your e-commerce site
frontend:
  customWebsite:
    enabled: true
    image:
      repository: "your-registry/ecommerce-site"
      tag: "latest"
  widget:
    theme: "light"
    position: "bottom-right"
    welcomeMessage: "Welcome! How can I help you with your order?"
```

### 2. SaaS Application
```yaml
# Deploy ChatKit for your SaaS app
backend:
  replicaCount: 5
  autoscaling:
    enabled: true
    minReplicas: 5
    maxReplicas: 20
  env:
    ALLOWED_ORIGINS: "https://app.yourdomain.com,https://dashboard.yourdomain.com"
```

### 3. Documentation Site
```yaml
# Deploy ChatKit for documentation
frontend:
  customWebsite:
    enabled: true
    image:
      repository: "your-registry/docs-site"
      tag: "latest"
  widget:
    theme: "dark"
    position: "bottom-left"
    welcomeMessage: "Hi! I can help you find information in our docs."
```

### 4. Multi-tenant Application
```yaml
# Deploy ChatKit for multi-tenant app
backend:
  replicaCount: 10
  env:
    ALLOWED_ORIGINS: "https://tenant1.yourdomain.com,https://tenant2.yourdomain.com"
```

## 🔧 Advanced Configuration

### Auto-scaling
```yaml
backend:
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70
    targetMemoryUtilizationPercentage: 80
```

### Security
```yaml
security:
  podSecurityContext:
    runAsNonRoot: true
    runAsUser: 1001
    fsGroup: 1001
  containerSecurityContext:
    allowPrivilegeEscalation: false
    readOnlyRootFilesystem: false
    runAsNonRoot: true
    runAsUser: 1001
    capabilities:
      drop:
        - ALL
  podDisruptionBudget:
    enabled: true
    minAvailable: 1
```

### Monitoring
```yaml
monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
    interval: 30s
    scrapeTimeout: 10s
```

### Logging
```yaml
logging:
  level: "info"
  format: "json"
```

## 📊 Resource Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **Memory**: 4GB
- **Storage**: 20GB

### Recommended Requirements
- **CPU**: 4 cores
- **Memory**: 8GB
- **Storage**: 50GB

### Production Requirements
- **CPU**: 8+ cores
- **Memory**: 16GB+
- **Storage**: 100GB+

## 🚀 Deployment Examples

### 1. Development Environment
```bash
# Deploy for development
helm install chatkit-dev chatkit/chatkit \
  --set backend.replicaCount=1 \
  --set frontend.replicaCount=1 \
  --set ollama.enabled=false \
  --set openai.enabled=true \
  --set openai.apiKey="your-dev-api-key"
```

### 2. Staging Environment
```bash
# Deploy for staging
helm install chatkit-staging chatkit/chatkit \
  --set backend.replicaCount=2 \
  --set frontend.replicaCount=2 \
  --set ollama.model="llama2" \
  --set openai.enabled=true \
  --set openai.apiKey="your-staging-api-key"
```

### 3. Production Environment
```bash
# Deploy for production
helm install chatkit-prod chatkit/chatkit \
  -f examples/values-production.yaml \
  --set openai.apiKey="your-prod-api-key" \
  --set backend.security.sessionSecret="your-prod-session-secret" \
  --set backend.security.apiKeyHashSalt="your-prod-salt"
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Pods Not Starting
```bash
# Check pod status
kubectl get pods -l app.kubernetes.io/name=chatkit

# Check pod logs
kubectl logs -l app.kubernetes.io/name=chatkit

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp
```

#### 2. Service Not Accessible
```bash
# Check service status
kubectl get svc -l app.kubernetes.io/name=chatkit

# Check ingress status
kubectl get ingress chatkit

# Test service connectivity
kubectl port-forward service/chatkit-frontend 8080:80
```

#### 3. Ollama Not Working
```bash
# Check Ollama pod
kubectl get pods -l app.kubernetes.io/component=ollama

# Check Ollama logs
kubectl logs -l app.kubernetes.io/component=ollama

# Test Ollama API
kubectl port-forward service/chatkit-ollama 11434:11434
curl http://localhost:11434/api/tags
```

#### 4. OpenAI API Issues
```bash
# Check secrets
kubectl get secrets chatkit-secrets

# Check secret content
kubectl get secret chatkit-secrets -o yaml

# Test API key
kubectl exec -it deployment/chatkit-backend -- curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

### Debug Commands

```bash
# Get all resources
kubectl get all -l app.kubernetes.io/name=chatkit

# Describe deployment
kubectl describe deployment chatkit-backend

# Check resource usage
kubectl top pods -l app.kubernetes.io/name=chatkit

# Check persistent volumes
kubectl get pv,pvc -l app.kubernetes.io/name=chatkit
```

## 📚 Additional Resources

- **[Configuration Guide](../CONFIGURATION_GUIDE.md)** - Detailed configuration options
- **[Architecture Documentation](../ARCHITECTURE_DOCUMENTATION.md)** - Technical details
- **[Deployment Guide](../DEPLOYMENT_GUIDE.md)** - Deployment instructions
- **[Security Guide](../SECURITY_GUIDE.md)** - Security configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the Helm chart
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

---

*This Helm chart provides a production-ready deployment of ChatKit with extensive customization options for any Kubernetes environment.*
