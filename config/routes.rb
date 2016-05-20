Rails.application.routes.draw do

  root 'site#angular'
  # api/ urls and default to json
  scope '/api', defaults: { format: :json } do
    # since we're just doing a json api we don't need new and edit pages to hold forms for our users
    resources :lists, except: [:new, :edit] do
      resources :items, except: [:new, :edit]
    end
  end

  # route all other requests to site#angular
  # our front-end router will then determine what to really display for that URL
  get '*path', to: 'site#angular'
end
