# Sample Website Container
FROM nginx:alpine

# Copy website files
COPY . /usr/share/nginx/html/

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Create directories and set permissions
RUN mkdir -p /run/nginx && \
    chown -R nginx:nginx /run/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
