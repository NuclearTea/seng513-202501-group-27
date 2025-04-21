FROM nginx:stable

# Copy main NGINX config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy site configurations
COPY sites/default.conf /etc/nginx/sites-available/default.conf
COPY sites-enabled/default.conf /etc/nginx/sites-enabled/default.conf

# (Optional) Link to conf.d if needed — useful if nginx.conf doesn't load from sites-enabled
RUN ln -sf /etc/nginx/sites-available/default.conf /etc/nginx/conf.d/default.conf
