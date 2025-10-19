# Sample Website Container
FROM nginx:alpine

# Copy website files
COPY . /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN addgroup -g 1001 -S nginx-user
RUN adduser -S website -u 1001

# Change ownership
RUN chown -R website:nginx-user /usr/share/nginx/html
RUN chown -R website:nginx-user /var/cache/nginx
RUN chown -R website:nginx-user /var/log/nginx
RUN chown -R website:nginx-user /etc/nginx/conf.d

# Switch to non-root user
USER website

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
