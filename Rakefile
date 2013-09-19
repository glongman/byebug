require 'rake/testtask'
require 'rake/extensiontask'
require 'bundler/gem_tasks'

Rake::ExtensionTask.new('byebug')

SO_NAME = "byebug.so"

desc "Run MiniTest suite"
task :test do
  Rake::TestTask.new(:test) do |t|
    t.test_files = FileList["test/*_test.rb"]
    t.warning = true
    t.verbose = true
  end
end

base_spec = eval(File.read('byebug.gemspec'), binding, 'byebug.gemspec')

task :default => :test

desc 'Run a test in looped mode so that you can look for memory leaks'
task 'test_loop' do
  code = %Q[loop{ require '#{$*[1]}' }]
  cmd = %Q[ruby -Itest -e "#{ code }"]
  system cmd
end

desc 'Watch memory use of a looping test'
task 'test_loop_mem' do
  system "watch \"ps aux | grep -v 'sh -c r' | grep [I]test\""
end

namespace :demo do
  desc 'Launch a simple fib demo in the debugger'
  task 'fib' do
    system "ruby demo/fib.rb"
  end

  desc 'Launch a simple fib demo in the debugger'
  task 'fib_mm' do
    system "./bin/byebug --post-mortem -Ilib demo/fib_mm.rb"
  end

  desc 'Launch a simple fib demo in the debugger'
  task 'socket' do
    system "ruby ws.rb&"
    system "open ./ui/debugger.html"
  end

  task 'remote_server' do
    require 'byebug'
    p Byebug::VERSION
    Byebug.wait_connection = true
    Byebug.start_websocket_server
#    system "open ./ui/debugger.html"
#    Byebug.post_mortem do
#      p "foo"
#      raise
#      p "bar"
#    end

    p "foo"
    byebug
    p "bar"
    p "foo2"
    p "bar2"
  end

  task "server" do
    require 'byebug'
    Byebug.wait_connection = true
    Byebug.start
    Byebug.start_server

    Byebug.post_mortem do
      p "foo"
      raise
      p "bar"
    end
#    Byebug.current_context.step_into
  end

  task "client" do
    require 'byebug'
    Byebug.start_client
  end
end
